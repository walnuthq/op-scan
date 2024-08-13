import { Address, Block } from "viem";
import { abiFromBytecode } from "@shazow/whatsabi";
import { l2PublicClient } from "@/lib/chains";
import { formatEventLog } from "@/lib/utils";
import { ABIEventExtended, FormattedLog } from "@/interfaces";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { ContractEventsTable } from "./address-contract-events-table";
const AddressEvents = async ({ address }: { address: Address }) => {
  try {
    const latestBlockNumber: bigint = await l2PublicClient.getBlockNumber();
    const fromBlock: bigint = latestBlockNumber - BigInt(10);
    const [bytecode, logs] = await Promise.all([
      l2PublicClient.getCode({ address }) as Promise<string>,
      l2PublicClient.getLogs({ address, fromBlock, toBlock: "latest" }),
    ]);

    const abi = abiFromBytecode(bytecode) as ABIEventExtended[];

    const blockTimestamps = await Promise.all(
      logs.map(async (log) => {
        const block: Block = await l2PublicClient.getBlock({
          blockNumber: log.blockNumber,
        });
        return block.timestamp;
      }),
    );

    const decodedLogs: FormattedLog[] = await Promise.all(
      logs.map(async (log, index) => {
        const formattedLog = await formatEventLog(log, abi);
        return {
          ...formattedLog,
          transactionHash: log.transactionHash,
          blockNumber: log.blockNumber,
          timestamp: blockTimestamps[index],
        };
      }),
    );

    decodedLogs.sort((a, b) =>
      Number(BigInt(b.timestamp) - BigInt(a.timestamp)),
    );

    return (
      <Card>
        <CardHeader>Latest 25 Contract Events</CardHeader>
        <CardContent>CONTRACT EVENTS</CardContent>
        <ContractEventsTable decodedLogs={decodedLogs} />
      </Card>
    );
  } catch (error) {
    console.error("Error fetching contract details:", error);
    return (
      <div className="flex w-full items-center justify-center">
        Error loading contract details. Please try again later.
      </div>
    );
  }
};

export default AddressEvents;
