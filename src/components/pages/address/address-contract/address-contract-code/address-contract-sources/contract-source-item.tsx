"use client";
import { useTheme } from "next-themes";
import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { ContractSource } from "@/lib/types";
import { PrismLight as SyntaxHighlighter } from "react-syntax-highlighter";
import virtualizedRenderer from "react-syntax-highlighter-virtualized-renderer";
import solidity from "react-syntax-highlighter/dist/esm/languages/prism/solidity";
import json from "react-syntax-highlighter/dist/esm/languages/prism/json";
import {
  vs,
  vscDarkPlus,
} from "react-syntax-highlighter/dist/esm/styles/prism";

SyntaxHighlighter.registerLanguage("solidity", solidity);
SyntaxHighlighter.registerLanguage("json", json);

const getLanguage = (path: string) => {
  if (path.endsWith(".sol")) {
    return "solidity";
  }
  if (path.endsWith(".json")) {
    return "json";
  }
  return "text";
};

const ContractSourceItem = ({ source }: { source: ContractSource }) => {
  const { resolvedTheme } = useTheme();
  return (
    <AccordionItem value={source.path}>
      <AccordionTrigger>{source.path}</AccordionTrigger>
      <AccordionContent>
        <SyntaxHighlighter
          className="h-96 overflow-y-scroll rounded-md"
          showLineNumbers
          showInlineLineNumbers
          language={getLanguage(source.path)}
          style={resolvedTheme === "light" ? vs : vscDarkPlus}
          renderer={virtualizedRenderer()}
        >
          {source.path.endsWith(".json")
            ? JSON.stringify(JSON.parse(source.content), null, 2)
            : source.content}
        </SyntaxHighlighter>
      </AccordionContent>
    </AccordionItem>
  );
};

export default ContractSourceItem;
