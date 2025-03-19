"use client";
import { startCase } from "lodash";
import { cn } from "@/lib/utils";
import { type Account } from "@/lib/types";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import useGlobalContext from "@/components/lib/context/hook";

const TxMethodBadge = ({
  selector,
  signature,
  account,
}: {
  selector: string;
  signature: string;
  account?: Account;
}) => {
  const {
    state: { hoveredSelector },
    setHoveredSelector,
  } = useGlobalContext();
  const [symbol] = signature.split("(");
  const method = startCase(symbol);
  return (
    <Tooltip
      delayDuration={100}
      onOpenChange={(open) => setHoveredSelector(open ? selector : "")}
    >
      <TooltipTrigger
        className={cn(
          "w-32 truncate rounded-md border px-2 py-1 text-xs transition-colors hover:border-dashed hover:border-yellow-500 hover:bg-yellow-500/15",
          {
            "border-dashed border-yellow-500 bg-yellow-500/15":
              hoveredSelector === selector,
          },
        )}
      >
        {selector === "0x"
          ? "Native Transfer"
          : account
            ? "Deploy Contract"
            : signature === ""
              ? selector
              : method}
      </TooltipTrigger>
      <TooltipContent>
        <p>
          {selector === "0x"
            ? "Native Transfer"
            : account
              ? "Deploy Contract"
              : signature === ""
                ? selector
                : signature}
        </p>
      </TooltipContent>
    </Tooltip>
  );
};

export default TxMethodBadge;
