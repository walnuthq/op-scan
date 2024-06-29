import { l2PublicClient } from "@/lib/chains";

export async function fetchL2LatestTransactions() {
    const latestBlock = await l2PublicClient.getBlockNumber();
    let transactions: any[] = [];
  
    for (let i = 0; i < 10; i++) {
      const block = await l2PublicClient.getBlock({
        blockNumber: latestBlock - BigInt(i),
        includeTransactions: true,
      });
      if (block && block.transactions) {
        const txsWithTimestamp = block.transactions.map((tx: any) => ({
          ...tx,
          timestamp: block.timestamp
        }));
        transactions = [...transactions, ...txsWithTimestamp];
      }
      if (transactions.length >= 50) break;
    }
  
    return transactions
      .slice(0, 50)
      .sort((a: any, b: any) => Number(b.timestamp) - Number(a.timestamp));
  }