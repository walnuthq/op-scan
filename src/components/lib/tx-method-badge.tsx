"use client"
import { startCase } from "lodash";
import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import useGlobalContext from "@/components/lib/context/hook";

const TxMethodBadge = ({
  selector,
  signature,
}: {
  selector: string;
  signature: string;
}) => {
  const {
    state: { hoveredSelector },
    setHoveredSelector,
  } = useGlobalContext();
  const [symbol] = signature.split("(");
  const method = startCase(symbol);
  return (
    <TooltipProvider>
      <Tooltip
        delayDuration={100}
        onOpenChange={(open) => setHoveredSelector(open ? selector : "")}
      >
        <TooltipTrigger>
          <div
            className={cn(
              "w-28 truncate rounded-md border px-2 py-1 text-xs transition-colors hover:border-dashed hover:border-yellow-500 hover:bg-yellow-500/15",
              {
                "border-dashed border-yellow-500 bg-yellow-500/15":
                  hoveredSelector === selector,
              },
            )}
          >
            {signature === ""
              ? selector === "0x"
                ? "Native Transfer"
                : selector
              : method}
          </div>
        </TooltipTrigger>
        <TooltipContent>
          <p>
            {signature === ""
              ? selector === "0x"
                ? "Native Transfer"
                : selector
              : signature}
          </p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default TxMethodBadge;
