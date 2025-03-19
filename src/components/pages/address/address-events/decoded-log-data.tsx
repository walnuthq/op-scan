"use client";
import Link from "next/link";
import { type DecodedData } from "@/components/pages/address/address-events/fetch-events";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState } from "react";

const DecodedLogData = ({ decodedData }: { decodedData: DecodedData }) => {
  const [format, setFormat] = useState<keyof DecodedData>("hex");
  return (
    <div className="flex items-center gap-3">
      <Select onValueChange={(value: keyof DecodedData) => setFormat(value)}>
        <SelectTrigger className="mr-0.5 h-8 w-20 px-2 py-1">
          <SelectValue placeholder="Hex" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectItem value="hex">Hex</SelectItem>
            <SelectItem value="number">Number</SelectItem>
            <SelectItem value="text">Text</SelectItem>
            {decodedData.address && (
              <SelectItem value="address">Address</SelectItem>
            )}
          </SelectGroup>
        </SelectContent>
      </Select>
      <div className="font-mono font-semibold">
        {format === "hex" && <p>{decodedData.hex}</p>}
        {format === "number" && <p>{decodedData.number.toString()}</p>}
        {format === "text" && <p>{decodedData.text}</p>}
        {format === "address" && (
          <Link
            href={`/address/${decodedData.address}`}
            className="text-primary hover:brightness-150"
          >
            {decodedData.address}
          </Link>
        )}
      </div>
    </div>
  );
};

export default DecodedLogData;
