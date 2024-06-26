import { createPublicClient, http } from 'viem';
import { optimism } from 'viem/chains';

const client = createPublicClient({
  chain: optimism,
  transport: http(process.env.RPC_URL),
});

export async function getLatestTransactions() {
    const latestBlock = await client.getBlockNumber();
    let transactions: any[] = [];
  
    for (let i = 0; i < 10; i++) {
      const block = await client.getBlock({
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