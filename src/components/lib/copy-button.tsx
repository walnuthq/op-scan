"use client";
import { useState } from "react";
import { Copy, Check } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const CopyButton = ({
  content,
  copy,
}: {
  className?: string;
  content: string;
  copy: string;
}) => {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const copyText = async () => {
    setOpen(true);
    await navigator.clipboard.writeText(copy);
    setCopied(true);
    await sleep(1000);
    setOpen(false);
    await sleep(100);
    setCopied(false);
  };
  return (
    <div className="mx-3 flex">
      <TooltipProvider>
        <Tooltip delayDuration={100} open={open} onOpenChange={setOpen}>
          <TooltipTrigger
            className="text-muted-foreground hover:text-primary hover:brightness-150"
            onClick={copied ? undefined : copyText}
          >
            {copied ? (
              <Check className="size-4" />
            ) : (
              <Copy className="size-4" />
            )}
          </TooltipTrigger>
          <TooltipContent>
            <p>{copied ? "Copied!" : content}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
};

export default CopyButton;
