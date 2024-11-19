export const l1BlockTime = process.env.NEXT_PUBLIC_L1_BLOCK_TIME
  ? Number(process.env.NEXT_PUBLIC_L1_BLOCK_TIME)
  : 12;

export const l2BlockTime = process.env.NEXT_PUBLIC_L2_BLOCK_TIME
  ? Number(process.env.NEXT_PUBLIC_L2_BLOCK_TIME)
  : 2;

export const blocksPerPage = process.env.NEXT_PUBLIC_BLOCKS_PER_PAGE
  ? Number(process.env.NEXT_PUBLIC_BLOCKS_PER_PAGE)
  : 25;

export const txsPerPage = process.env.NEXT_PUBLIC_TXS_PER_PAGE
  ? Number(process.env.NEXT_PUBLIC_TXS_PER_PAGE)
  : 50;

export const txsEnqueuedPerPage = process.env.NEXT_PUBLIC_TXS_ENQUEUED_PER_PAGE
  ? Number(process.env.NEXT_PUBLIC_TXS_ENQUEUED_PER_PAGE)
  : 50;

export const eventsPerPage = process.env.NEXT_PUBLIC_EVENTS_PER_PAGE
  ? Number(process.env.NEXT_PUBLIC_EVENTS_PER_PAGE)
  : 25;

export const transactionsHistoryCount = process.env
  .NEXT_PUBLIC_TRANSACTIONS_HISTORY_COUNT
  ? Number(process.env.NEXT_PUBLIC_TRANSACTIONS_HISTORY_COUNT)
  : 14;
