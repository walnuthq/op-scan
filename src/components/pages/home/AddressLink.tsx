import { useContext, useEffect, useState } from "react";
import Link from "next/link";
import { AddressContext } from "@/components/lib/context/AddressContext";
import { SquareArrowOutUpRight } from "lucide-react";

interface AddressLinkProps {
  addressClassName: string;
  address: string | null;
  href: string;
  children: React.ReactNode;
}

const AddressLink = ({
  addressClassName,
  address,
  href,
  children,
}: AddressLinkProps) => {
  const { state, dispatch } = useContext(AddressContext);
  const [isSameOrigin, setIsSameOrigin] = useState<boolean | null>(null);

  useEffect(() => {
    const currentOrigin = window.location.origin;
    const linkOrigin = new URL(href, currentOrigin).origin;
    setIsSameOrigin(currentOrigin === linkOrigin);
  }, [href]);

  const handleMouseEnter = () => {
    dispatch({ type: "SET_HOVERED_ADDRESS", payload: address });
  };

  const handleMouseLeave = () => {
    dispatch({ type: "SET_HOVERED_ADDRESS", payload: null });
  };

  return (
    <Link
      href={href}
      className={`flex items-center text-primary hover:brightness-150`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <span className={`relative p-1 ${addressClassName}`}>
        {children}
        <span
          className={`pointer-events-none absolute inset-0 rounded border border-dashed border-[#FFC107] bg-[#FFC107] bg-opacity-5 transition-opacity ${
            state.hoveredAddress === address ? "opacity-100" : "opacity-0"
          }`}
        ></span>
      </span>
      {isSameOrigin === false && (
        <SquareArrowOutUpRight className="ml-1 size-4" />
      )}
    </Link>
  );
};

export default AddressLink;
