import { isAddress } from "viem";
import Link from "next/link";

const DecodedParameterValueSingle = ({ value }: { value: unknown }) => {
  if (typeof value === "bigint") {
    return <span>{value.toString()}</span>;
  } else if (typeof value === "string") {
    return isAddress(value) ? (
      <Link
        href={`/address/${value}`}
        className="text-primary font-mono hover:brightness-150"
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

const DecodedParameterValue = ({ value }: { value: unknown }) =>
  Array.isArray(value) ? (
    <ul>
      {value.map((singleValue, index) => (
        <li key={index}>
          <DecodedParameterValueSingle value={singleValue} />
        </li>
      ))}
    </ul>
  ) : (
    <DecodedParameterValueSingle value={value} />
  );

export default DecodedParameterValue;
