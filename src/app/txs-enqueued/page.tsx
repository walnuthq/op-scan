import TxsEnqueued from "@/components/pages/txs-enqueued";

const TxsEnqueuedPage = async ({
  searchParams: { page },
}: {
  searchParams: { page?: string };
}) => <TxsEnqueued page={page ? Number(page) : 1} />;

export default TxsEnqueuedPage;
