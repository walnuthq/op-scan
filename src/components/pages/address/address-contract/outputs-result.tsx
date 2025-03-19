import { type AbiParameter, isAddress } from "viem";
import Link from "next/link";
import { JSONTree, type KeyPath } from "react-json-tree";
import { cn } from "@/lib/utils";
import CopyButton from "@/components/lib/copy-button";

const keyPathToAbiParameter = (keyPath: KeyPath, output: AbiParameter) => {
  const [currentKey, ...rest] = keyPath;
  const { components } = output as { components: readonly AbiParameter[] };
  if (typeof currentKey === "string") {
    const current = components.find(({ name }) => name === currentKey);
    if (!current) {
      return output;
    }
    return keyPathToAbiParameter(rest, current);
  } else if (typeof currentKey === "number") {
    const safeType = output.internalType ?? output.type;
    const matches = safeType.match(/(.*)\[(\d*)\]/);
    if (!matches) {
      return output;
    }
    const [, type] = matches;
    if (!type) {
      return output;
    }
    const current = {
      ...output,
      name: currentKey.toString(),
      type,
      internalType: type,
      components,
    };
    return keyPathToAbiParameter(rest, current);
  }
  return output;
};

const OutputResultValue = ({ value }: { value: unknown }) => {
  if (typeof value === "boolean") {
    return <span>{value ? "true" : "false"}</span>;
  } else if (typeof value === "number" || typeof value === "bigint") {
    return <span>{value.toString()}</span>;
  } else if (typeof value === "string") {
    return isAddress(value) ? (
      <div className="ml-2 inline-flex items-center gap-2">
        <Link
          href={`/address/${value}`}
          className="text-primary font-mono hover:brightness-150"
        >
          {value}
        </Link>
        <CopyButton content="Copy Address" copy={value} />
      </div>
    ) : (
      <span>{value}</span>
    );
  } else {
    return null;
  }
};

const OutputResultField = ({
  output,
  isLeaf,
  value,
}: {
  output: AbiParameter;
  isLeaf?: boolean;
  value?: unknown;
}) => (
  <div className={cn("flex", { "gap-2": isLeaf, "gap-4": !isLeaf })}>
    {output.name && <span className="font-semibold">{output.name}</span>}
    <span className="text-muted-foreground italic">
      {output.internalType ?? output.type}
    </span>
    {value !== undefined && <OutputResultValue value={value} />}
  </div>
);

const OutputResult = ({
  output,
  result,
}: {
  output: AbiParameter;
  result: unknown;
}) =>
  typeof result === "object" ? (
    <JSONTree
      theme={{
        base00: "transparent", // background
        base03: "hsl(var(--muted-foreground))", // objects / arrays label
        base09: "hsl(var(--foreground))", // boolean
        base0B: "hsl(var(--foreground))", // string
        base0D: "hsl(var(--foreground))", // label
      }}
      data={result}
      shouldExpandNodeInitially={() => true}
      labelRenderer={(keyPath, nodeType) => (
        <OutputResultField
          output={keyPathToAbiParameter(keyPath.slice(0, -1).reverse(), output)}
          isLeaf={["Object", "Array"].includes(nodeType)}
        />
      )}
      valueRenderer={(valueAsString, value) => (
        <OutputResultValue value={value} />
      )}
    />
  ) : (
    <OutputResultField output={output} isLeaf value={result} />
  );

const OutputsResult = ({
  outputs,
  result,
}: {
  outputs: readonly AbiParameter[];
  result?: unknown;
}) =>
  outputs.map((output, index) =>
    !Array.isArray(result) || output.type.endsWith("]") ? (
      <OutputResult key={index} output={output} result={result} />
    ) : (
      <OutputResult key={index} output={output} result={result[index]} />
    ),
  );

export default OutputsResult;
