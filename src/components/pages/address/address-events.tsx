
import Link from "next/link";
import { Address, Block } from "viem";
import { abiFromBytecode, whatsabi } from "@shazow/whatsabi";

import { l2PublicClient } from "@/lib/chains";
import { formatEventLog, formatTimestamp } from "@/lib/utils";

import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { DecodedLogDisplay } from "@/components/ui/decodedLog-display"

import { ABIEventExtended, FormattedLog } from "@/interfaces";

const AddressEvents = async ({ address }: { address: Address }) => {
  try {
    const latestBlockNumber: bigint = await l2PublicClient.getBlockNumber();
    const fromBlock: bigint = latestBlockNumber - BigInt(10);
    const [bytecode, logs] = await Promise.all([
      l2PublicClient.getCode({ address }) as Promise<string>,
      l2PublicClient.getLogs({ address, fromBlock, toBlock: 'latest' }),
    ]);

    const signatureLookup = new whatsabi.loaders.OpenChainSignatureLookup();
    const abi = abiFromBytecode(bytecode) as ABIEventExtended[];

    const blockTimestamps = await Promise.all(logs.map(async log => {
      const block: Block = await l2PublicClient.getBlock({ blockNumber: log.blockNumber });
      return block.timestamp;
    }));

    const decodedLogs: FormattedLog[] = await Promise.all(logs.map(async (log, index) => {
      const formattedLog = await formatEventLog(log, abi, signatureLookup);
      return {
        ...formattedLog,
        transactionHash: log.transactionHash,
        blockNumber: log.blockNumber,
        timestamp: {
          ...formatTimestamp(blockTimestamps[index]),
          originalTimestamp: blockTimestamps[index],
        },
      };
    }));

    decodedLogs.sort((a, b) => Number(BigInt(b.timestamp.originalTimestamp) - BigInt(a.timestamp.originalTimestamp)));

    return (
      <section className="flex flex-1 justify-center items-center flex-col gap-4 p-4 md:gap-4 md:p-4">
        {
          decodedLogs.length !== 0
          ? (
            <Table className="table-auto">
          <TableHeader>
            <TableRow>
              <TableHead>Transaction Hash</TableHead>
              <TableHead>Block</TableHead>
              <TableHead>Timestamp</TableHead>
              <TableHead>Method</TableHead>
              <TableHead>Decoded logs</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {decodedLogs.map((item, index) => (
              <TableRow key={index}>
                <TableCell className="max-w-40 relative truncate align-top text-primary hover:brightness-150">
                  <Link
                    href={`/tx/${item.transactionHash}`}
                    className="text-sm font-medium leading-none"
                  >
                    {item.transactionHash}
                  </Link>
                </TableCell>
                <TableCell className="max-w-28 truncate text-primary align-top hover:brightness-150">
                  <Link
                    href={`/block/${item.blockNumber}`}
                    className="text-sm font-medium leading-none"
                  >
                    {item.blockNumber.toString().slice(1)}
                  </Link>
                </TableCell>
                <TableCell className="align-top">
                  <div>
                    {`${item.timestamp.distance}`}
                  </div>
                </TableCell>
                <TableCell className="align-top">
                  {item.method}
                </TableCell>
                <TableCell className="align-top">
                  <DecodedLogDisplay args={ item.args } />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
          )
          : (
            <span className="text-xl font-semibold">Oops! No events found. Please reload the page</span>
          )
        }
      </section>
    );
  } catch (error) {
    console.error("Error fetching contract details:", error);
    return <div className="w-full flex justify-center items-center">Error loading contract details. Please try again later.</div>;
  }
};

export default AddressEvents;
