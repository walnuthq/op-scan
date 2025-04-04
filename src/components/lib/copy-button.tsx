"use client";
import { useState } from "react";
import { Copy, Check } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { sleep } from "@/lib/utils";

const CopyButton = ({ content, copy }: { content: string; copy: string }) => {
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
    <Tooltip delayDuration={100} open={open} onOpenChange={setOpen}>
      <TooltipTrigger
        className="text-muted-foreground hover:text-primary hover:brightness-150"
        onClick={copied ? undefined : copyText}
      >
        {copied ? <Check className="size-4" /> : <Copy className="size-4" />}
      </TooltipTrigger>
      <TooltipContent>
        <p>{copied ? "Copied!" : content}</p>
      </TooltipContent>
    </Tooltip>
  );
};

export default CopyButton;
