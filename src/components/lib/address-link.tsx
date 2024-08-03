
import Link from "next/link";
import { SquareArrowOutUpRight } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import useGlobalContext from "@/components/lib/context/hook";

interface AddressLinkProps {
  address: string | null;
  href: string;
  isExternal?: boolean;
}

const AddressLink = ({
  address,
  href,
  isExternal = false
}: AddressLinkProps) => {
  const {
    state: { hoveredAddress },
    setHoveredAddress,
  } = useGlobalContext();


  return (
    <TooltipProvider>
      <Tooltip
        delayDuration={100}
        onOpenChange={(open) => setHoveredAddress((open && address) ? address : "")}
      >
        <TooltipTrigger>
            <Link
            href={href}
            className={"flex items-center"}
            >
                <div
                className={cn(
                    "w-28 rounded-md border px-2 py-1 text-xs transition-colors hover:border-dashed hover:border-yellow-500 hover:bg-yellow-500/15",
                    {
                        "border-dashed border-yellow-500 bg-yellow-500/15":
                        hoveredAddress === address,
                    },
                    )}
                >
                    {address?.slice(0,10).concat("...")}
                </div>
                {!isExternal && (
                    <SquareArrowOutUpRight className="ml-1 size-4" />
                )}
            </Link>
        </TooltipTrigger>
        <TooltipContent>
          <p>
            {address}
          </p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default AddressLink;
