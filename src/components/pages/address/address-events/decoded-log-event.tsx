import { type AbiEvent, type Hex, decodeAbiParameters } from "viem";
import { type AbiEventParameter } from "abitype";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import DecodedParameterValue from "@/components/lib/decoded-parameter-value";

const SignatureParameter = ({
  input,
  index,
  inputsCount,
}: {
  input: AbiEventParameter;
  index: number;
  inputsCount: number;
}) => (
  <>
    <div className="inline-flex gap-1">
      {input.indexed && <span>index_topic_{index + 1}</span>}
      <span className="text-green-500">{input.type}</span>
      {input.name && <span className="text-red-500">{input.name}</span>}
    </div>
    {index !== inputsCount - 1 && <span className="mr-1">,</span>}
  </>
);

const DecodedParameter = ({
  input,
  value,
}: {
  input: AbiEventParameter;
  value: unknown;
}) => (
  <div className="flex flex-col gap-1">
    <div className="flex gap-2 font-semibold">
      <span className="text-muted-foreground italic">{input.type}</span>
      <span>{input.name}</span>
    </div>
    <DecodedParameterValue value={value} />
  </div>
);

const DecodedLogEvent = ({
  abiEvent,
  data,
}: {
  abiEvent: AbiEvent;
  data: Hex;
}) => {
  const decodedParameters = decodeAbiParameters(abiEvent.inputs, data);
  return (
    <Accordion type="single" collapsible className="w-full">
      <AccordionItem value={abiEvent.name}>
        <AccordionTrigger className="justify-start gap-0.5 hover:no-underline">
          *** {abiEvent.name}(
          {abiEvent.inputs.map((input, index) => (
            <SignatureParameter
              key={index}
              input={input}
              index={index}
              inputsCount={abiEvent.inputs.length}
            />
          ))}
          )
        </AccordionTrigger>
        <AccordionContent className="flex flex-col gap-2">
          {abiEvent.inputs.map((input, index) => (
            <DecodedParameter
              key={index}
              input={input}
              value={decodedParameters[index]}
            />
          ))}
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
};

export default DecodedLogEvent;
