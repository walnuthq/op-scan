"use client";
import { DecodedArgs } from "@/interfaces";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState } from "react";

interface Props {
  args: DecodedArgs;
}

export const DecodedLogDisplay = ({ args }: Props) => {
  const [selectedFormat, setSelectedFormat] = useState("hex");

  const handleChange = (value: string) => {
    setSelectedFormat(value);
  };
  const getSelectedValue = () => {
    switch (selectedFormat) {
      case "number":
        return args.decoded[0]?.number || "N/A";
      case "address":
        return args.decoded[0]?.address || "N/A";
      default:
        return args.decoded[0]?.hex || "N/A";
    }
  };

  return (
    <div>
      <span className="tracking-widest text-primary opacity-70">
        *** {args.function}
      </span>
      <div className="flex flex-col gap-1 py-2">
        {args.topics.map((topic, index) => (
          <div key={index} className="flex items-center justify-start gap-3">
            <strong>[topic{index}]</strong>
            <p className="opacity-50">{topic}</p>
          </div>
        ))}
      </div>
      <div className="flex items-center justify-start gap-1">
        <Select onValueChange={handleChange}>
          <SelectTrigger className="w-[100px]">
            <SelectValue placeholder="Hex" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem value="hex">Hex</SelectItem>
              <SelectItem value="number">Number</SelectItem>
              <SelectItem value="address">Address</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
        <div className="ml-2">{getSelectedValue()}</div>
      </div>
    </div>
  );
};