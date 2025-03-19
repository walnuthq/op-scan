import { type ChangeEvent } from "react";
import { zeroAddress } from "viem";
import { type WidgetProps } from "@rjsf/utils";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";

const CheckboxWidget = ({ id, value, onChange }: WidgetProps) => (
  <Switch
    id={id}
    value={value}
    onCheckedChange={(checked) => onChange(checked, undefined, id)}
  />
);

const getPlaceholder = (type?: string) => {
  switch (type) {
    case "bytes1":
    case "bytes2":
    case "bytes3":
    case "bytes4":
    case "bytes5":
    case "bytes6":
    case "bytes7":
    case "bytes8":
    case "bytes9":
    case "bytes10":
    case "bytes11":
    case "bytes12":
    case "bytes13":
    case "bytes14":
    case "bytes15":
    case "bytes16":
    case "bytes17":
    case "bytes18":
    case "bytes19":
    case "bytes20":
    case "bytes21":
    case "bytes22":
    case "bytes23":
    case "bytes24":
    case "bytes25":
    case "bytes26":
    case "bytes27":
    case "bytes28":
    case "bytes29":
    case "bytes30":
    case "bytes31":
    case "bytes32":
    case "bytes":
      return "0x";
    case "address":
      return zeroAddress;
    default:
      return "";
  }
};

const TextWidget = ({ id, schema, value, onChange }: WidgetProps) => (
  <Input
    id={id}
    type="text"
    value={value}
    onChange={({ target: { value } }: ChangeEvent<HTMLInputElement>) =>
      onChange(value, undefined, id)
    }
    pattern={schema.pattern}
    placeholder={getPlaceholder(schema.description)}
    required
  />
);

const widgets = {
  CheckboxWidget,
  TextWidget,
};

export default widgets;
