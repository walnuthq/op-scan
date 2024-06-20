import BlckTxs from "@/components/pages/block/txs";

const BlckTxsPage = ({ params: { number } }: { params: { number: bigint } }) => (
    <BlckTxs number={number}/>
  );
  
  export default BlckTxsPage;
  