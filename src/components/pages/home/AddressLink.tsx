import { useContext } from "react";
import Link from "next/link";
import { AddressContext } from "@/components/lib/context/AddressContext";

interface AddressLinkProps {
  type: string;
  label: string;
  address: string | null;
  href: string;
  children: React.ReactNode;
}

const AddressLink = ({
  type,
  label,
  address,
  href,
  children,
}: AddressLinkProps) => {
  const { state, dispatch } = useContext(AddressContext);

  const handleMouseEnter = () => {
    dispatch({ type: "SET_HOVERED_ADDRESS", payload: address });
  };

  const handleMouseLeave = () => {
    dispatch({ type: "SET_HOVERED_ADDRESS", payload: null });
  };

  const className = `truncate ${
    type === "l1-l2"
      ? "max-w-28 md:max-w-48 xl:max-w-28"
      : type === "latest-transactions" && label === "tx"
        ? "max-w-60 md:max-w-96 xl:max-w-60"
        : "max-w-36 md:max-w-48 xl:max-w-36"
  }`;

  return (
    <Link
      href={href}
      className={`flex items-center text-primary hover:brightness-150 ${
        state.hoveredAddress === address ? "text-yellow-200" : ""
      }`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <span className={className}>{children}</span>
    </Link>
  );
};

export default AddressLink;
