import { Hash } from "viem";
import Tx from "@/components/pages/tx";

const TxPage = ({ params: { hash } }: { params: { hash: string } }) => (
  <Tx hash={hash as Hash} />
);

export default TxPage;
