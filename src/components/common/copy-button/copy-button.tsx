"use client";

import { CommonTooltip } from "@/components/common/tooltip";
import { Copy, Check } from "lucide-react";
import React, { useState } from "react";

export function CopyButton({ toCopy }: { toCopy: string }) {
  const [copied, setCopied] = useState(false); // State to manage copy status

  const copyAddress = () => {
    navigator.clipboard
      .writeText(toCopy)
      .then(() => {
        setCopied(true); // Set copied state to true
        setTimeout(() => setCopied(false), 1000); // Revert back after 1 second
      })
      .catch((err) => console.error("Failed to copy address: ", err));
  };

  return (
    <div>
      {copied ? (
        <Check size={16} className="ml-4 text-green-500" />
      ) : (
        <CommonTooltip tooltipMessage="Copy Address" asChild>
          <Copy
            size={16}
            className="ml-4 cursor-pointer"
            onClick={copyAddress}
          />
        </CommonTooltip>
      )}
    </div>
  );
}
