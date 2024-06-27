"use client";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { ReactNode, useRef } from "react";

type Props = {
  className?: string;
  tooltipClassName?: string;
  children: ReactNode;
  tooltipMessage: ReactNode;
  asChild?: boolean;
  hideOnClick?: boolean;
  delayDuration?: number;
};

export function CommonTooltip(props: Props) {
  const {
    className,
    children,
    tooltipMessage,
    asChild,
    hideOnClick = true,
    tooltipClassName,
    delayDuration = 0,
  } = props;
  const triggerRef = useRef(null);
  return (
    <TooltipProvider>
      <Tooltip delayDuration={delayDuration}>
        <TooltipTrigger
          className={className}
          asChild={asChild}
          onClick={(event) => {
            if (!hideOnClick) event.preventDefault();
          }}
          ref={triggerRef}
        >
          {children}
        </TooltipTrigger>
        <TooltipContent
          className={tooltipClassName}
          onPointerDownOutside={(event) => {
            if (event.target === triggerRef.current && !hideOnClick)
              event.preventDefault();
          }}
        >
          {tooltipMessage}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
