"use client";
import { useTheme } from "next-themes";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { ContractSource } from "@/components/pages/address/address-contract/fetch-contract";
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

const ContractSourceItem = ({ source }: { source: ContractSource }) => {
  const { resolvedTheme } = useTheme();
  return (
    <Accordion type="multiple">
      <AccordionItem value={source.path}>
        <AccordionTrigger>{source.path}</AccordionTrigger>
        <AccordionContent>
          <SyntaxHighlighter
            className="h-96 overflow-y-scroll rounded-md"
            showLineNumbers
            showInlineLineNumbers
            language={source.path.endsWith(".sol") ? "solidity" : "json"}
            style={resolvedTheme === "light" ? vs : vscDarkPlus}
            renderer={virtualizedRenderer()}
          >
            {source.path.endsWith(".sol")
              ? source.content
              : JSON.stringify(JSON.parse(source.content), null, 2)}
          </SyntaxHighlighter>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
};

export default ContractSourceItem;
