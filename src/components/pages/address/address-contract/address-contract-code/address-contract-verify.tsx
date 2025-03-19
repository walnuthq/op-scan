import { type Address } from "viem";
import Link from "next/link";

const AddressContractVerify = ({ address }: { address: Address }) => (
  <p className="flex items-center gap-1 text-sm">
    Are you the contract creator?
    <Link
      className="text-primary hover:brightness-150"
      href={`/verify-contract?address=${address}`}
    >
      Verify & Publish
    </Link>
    your contract source code today.
  </p>
);

export default AddressContractVerify;
