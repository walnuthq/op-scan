import TxsEnqueued from "@/components/pages/txs-enqueued";

const TxsEnqueuedPage = async ({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) => {
  const { page } = await searchParams;
  return <TxsEnqueued page={page ? Number(page) : 1} />;
};

export default TxsEnqueuedPage;
