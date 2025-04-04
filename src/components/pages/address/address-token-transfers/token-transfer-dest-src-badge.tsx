import { cn } from "@/lib/utils";

const TokenTransferDestSrcBadge = ({ type }: { type: "dest" | "src" }) => (
  <span
    className={cn(
      "inline-flex items-center rounded-md px-2 py-1 text-xs font-medium uppercase ring-1 ring-inset",
      {
        "bg-yellow-50 text-yellow-800 ring-yellow-600/20 dark:bg-yellow-400/10 dark:text-yellow-500 dark:ring-yellow-400/20":
          type === "dest",
        "bg-green-50 text-green-700 ring-green-600/20 dark:bg-green-500/10 dark:text-green-400 dark:ring-green-500/20":
          type === "src",
      },
    )}
  >
    {type}
  </span>
);

export default TokenTransferDestSrcBadge;
