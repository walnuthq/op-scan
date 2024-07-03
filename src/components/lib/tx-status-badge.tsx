import { CircleCheck, CircleX } from "lucide-react";
import { cn } from "@/lib/utils";

const TxStatusBadge = ({ success }: { success: boolean }) => (
  <span
    className={cn(
      "inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset",
      {
        "bg-green-500/10 text-green-400 ring-green-500/20": success,
        "bg-red-500/10 text-red-400 ring-red-500/20": !success,
      },
    )}
  >
    <>
      {success ? (
        <CircleCheck className="mr-1 size-3" />
      ) : (
        <CircleX className="mr-1 size-3" />
      )}
      {success ? "Success" : "Reverted"}
    </>
  </span>
);

export default TxStatusBadge;
