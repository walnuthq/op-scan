import { ReactNode } from "react";
import { cn } from "@/lib/utils";

const DescriptionListItem = ({
  title,
  border = false,
  children,
  secondary = false,
}: {
  title: string;
  border?: boolean;
  secondary?: boolean;
  children: ReactNode;
}) => (
  <div
    className={cn(
      { "border-t border-gray-100 dark:border-white/10": border },
      "px-4 py-3 sm:px-0",
      secondary ? "flex flex-col sm:gap-3" : "sm:grid sm:grid-cols-3 sm:gap-4",
    )}
  >
    <dt
      className={cn("text-sm font-medium leading-6", {
        "text-muted-foreground": secondary,
      })}
    >
      {title}
      {secondary ? "" : ":"}
    </dt>
    <dd className="mt-1 flex items-center text-sm font-medium leading-6 sm:col-span-2 sm:mt-0">
      {children}
    </dd>
  </div>
);

export default DescriptionListItem;
