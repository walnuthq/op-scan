import { Hash } from "viem";
import Tx from "@/components/pages/tx";

const TxPage = ({ params: { hash } }: { params: { hash: Hash } }) => (
  <Tx hash={hash} />
);

export default TxPage;
