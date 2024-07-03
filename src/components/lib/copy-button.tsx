"use client";
import { useState } from "react";
import { Copy, Check } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const CopyButton = ({ content, copy }: { content: string; copy: string }) => {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const copyText = async () => {
    await navigator.clipboard.writeText(copy);
    setCopied(true);
    setTimeout(() => setCopied(false), 1000);
  };
  return (
    <TooltipProvider>
      <Tooltip delayDuration={100} open={open || copied} onOpenChange={setOpen}>
        <TooltipTrigger className="cursor-pointer text-muted-foreground hover:text-primary hover:brightness-150">
          {copied ? (
            <Check className="size-4" />
          ) : (
            <Copy className="size-4" onClick={copyText} />
          )}
        </TooltipTrigger>
        <TooltipContent>
          <p>{copied ? "Copied!" : content}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default CopyButton;
