import { isAddress } from "viem";
import Link from "next/link";

const DecodedParameterValue = ({ value }: { value: unknown }) => {
  if (typeof value === "bigint") {
    return <span>{value.toString()}</span>;
  } else if (typeof value === "string") {
    return isAddress(value) ? (
      <Link
        href={`/address/${value}`}
        className="text-primary hover:brightness-150"
      >
        {value}
      </Link>
    ) : (
      <span>{value}</span>
    );
  } else {
    return null;
  }
};

export default DecodedParameterValue;
