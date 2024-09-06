import { cn } from "@/lib/utils";

const TxTypeBadge = ({ type }: { type: "self" | "out" | "in" }) => (
  <span
    className={cn(
      "inline-flex items-center rounded-md px-2 py-1 text-xs font-medium uppercase ring-1 ring-inset",
      {
        "bg-gray-50 text-gray-600 ring-gray-500/10 dark:bg-gray-400/10 dark:text-gray-400 dark:ring-gray-400/20":
          type === "self",
        "bg-yellow-50 text-yellow-800 ring-yellow-600/20 dark:bg-yellow-400/10 dark:text-yellow-500 dark:ring-yellow-400/20":
          type === "out",
        "bg-green-50 text-green-700 ring-green-600/20 dark:bg-green-500/10 dark:text-green-400 dark:ring-green-500/20":
          type === "in",
      },
    )}
  >
    {type}
  </span>
);

export default TxTypeBadge;
