import { Abi } from "viem";
import { useTheme } from "next-themes";
import { ListChecks } from "lucide-react";
import { PrismLight as SyntaxHighlighter } from "react-syntax-highlighter";
import virtualizedRenderer from "react-syntax-highlighter-virtualized-renderer";
import json from "react-syntax-highlighter/dist/esm/languages/prism/json";
import {
  vs,
  vscDarkPlus,
} from "react-syntax-highlighter/dist/esm/styles/prism";
import CopyButton from "@/components/lib/copy-button";

SyntaxHighlighter.registerLanguage("json", json);

const AddressContractAbi = ({ abi }: { abi: Abi }) => {
  const { resolvedTheme } = useTheme();
  const abiString = JSON.stringify(abi, null, 2);
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1 text-sm">
          <ListChecks className="size-4" />
          <span className="font-semibold">Contract ABI</span>
        </div>
        <CopyButton content="Copy ABI" copy={abiString} />
      </div>
      <SyntaxHighlighter
        className="h-96 overflow-y-scroll rounded-md"
        language="json"
        style={resolvedTheme === "light" ? vs : vscDarkPlus}
        renderer={virtualizedRenderer()}
      >
        {abiString}
      </SyntaxHighlighter>
    </div>
  );
};

export default AddressContractAbi;
