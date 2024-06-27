import BlockTxs from "@/components/pages/block-txs";

const BlockTxsPage = ({
  params: { number },
}: {
  params: { number: string };
}) => <BlockTxs number={BigInt(number)} />;

export default BlockTxsPage;
