import { cn } from "@/lib/utils";
import { Trash } from "lucide-react";
import {
  FieldTemplateProps,
  ObjectFieldTemplateProps,
  ArrayFieldTemplateProps,
  SubmitButtonProps,
} from "@rjsf/utils";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { ReloadIcon } from "@radix-ui/react-icons";

const FieldTemplate = ({
  id,
  classNames,
  style,
  label,
  description,
  children,
}: FieldTemplateProps) => {
  const [labelPrefix, index] = label.split("-");
  return (
    <div className={cn(classNames, "space-y-2")} style={style}>
      <Label htmlFor={id} className="flex gap-1">
        {labelPrefix}
        {index ? `[${Number(index) - 1}]` : ""}
        <span className="italic text-muted-foreground">{description}</span>
      </Label>
      {children}
    </div>
  );
};

const ObjectFieldTemplate = ({ properties }: ObjectFieldTemplateProps) => (
  <div className="space-y-4">
    {properties.map((element) => (
      <div key={element.name}>{element.content}</div>
    ))}
  </div>
);

const ArrayFieldTemplate = ({
  items,
  canAdd,
  onAddClick,
}: ArrayFieldTemplateProps) => (
  <div className="space-y-4">
    {items.map((element) => (
      <div key={element.key} className="flex items-end gap-2">
        <div className="grow">{element.children}</div>
        {element.hasRemove && (
          <Button
            variant="destructive"
            type="button"
            onClick={element.onDropIndexClick(element.index)}
            size="icon"
          >
            <Trash className="size-4" />
          </Button>
        )}
      </div>
    ))}
    {canAdd && (
      <Button variant="outline" type="button" onClick={onAddClick}>
        Add item
      </Button>
    )}
  </div>
);

const SubmitButton = ({ uiSchema }: SubmitButtonProps) => {
  const submitButtonOptions =
    uiSchema && uiSchema["ui:options"]?.submitButtonOptions;
  const disabled = submitButtonOptions?.props?.disabled;
  return (
    <Button variant="destructive" type="submit" disabled={disabled}>
      {disabled && <ReloadIcon className="mr-2 size-4 animate-spin" />}
      {disabled ? "Loading…" : submitButtonOptions?.submitText}
    </Button>
  );
};

const templates = {
  FieldTemplate,
  ObjectFieldTemplate,
  ArrayFieldTemplate,
  ButtonTemplates: { SubmitButton },
};

export default templates;
