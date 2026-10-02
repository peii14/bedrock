"use client";

/** Boolean and single choice inputs: checkbox, switch and radio group. */

import { Checkbox, Description, FieldError, Label, Radio, RadioGroup, Switch } from "@heroui/react";
import { type FieldProps, useField } from "../context";
import type { Option } from "./select-field";

const ErrorText = ({ message }: { message: string }) =>
  message ? <p className="animate-enter text-xs text-danger">{message}</p> : null;

export const CheckboxInput = ({ label, description, isDisabled }: FieldProps) => {
  const { field, isInvalid, message } = useField<boolean>();
  return (
    <div className="flex flex-col gap-1">
      <Checkbox
        name={field.name}
        isSelected={field.state.value}
        onChange={field.handleChange}
        isInvalid={isInvalid}
        isDisabled={isDisabled ?? false}
      >
        <Checkbox.Content>
          <Checkbox.Control>
            <Checkbox.Indicator />
          </Checkbox.Control>
          <Label>{label}</Label>
        </Checkbox.Content>
      </Checkbox>
      {description && <Description>{description}</Description>}
      <ErrorText message={isInvalid ? message : ""} />
    </div>
  );
};

export const SwitchInput = ({ label, description, isDisabled }: FieldProps) => {
  const { field } = useField<boolean>();
  return (
    <div className="flex flex-col gap-1">
      <Switch
        name={field.name}
        isSelected={field.state.value}
        onChange={field.handleChange}
        isDisabled={isDisabled ?? false}
      >
        <Switch.Content>
          <Switch.Control>
            <Switch.Thumb />
          </Switch.Control>
          <Label>{label}</Label>
        </Switch.Content>
      </Switch>
      {description && <Description>{description}</Description>}
    </div>
  );
};

export const RadioInput = ({
  label,
  description,
  isDisabled,
  options,
}: FieldProps & { options: readonly Option[] }) => {
  const { field, isInvalid, message } = useField<string>();
  return (
    <RadioGroup
      name={field.name}
      value={field.state.value}
      onChange={field.handleChange}
      isInvalid={isInvalid}
      isDisabled={isDisabled ?? false}
    >
      <Label>{label}</Label>
      {options.map((option) => (
        <Radio key={option.id} value={option.id}>
          <Radio.Content>
            <Radio.Control>
              <Radio.Indicator />
            </Radio.Control>
            <Label>{option.label}</Label>
          </Radio.Content>
        </Radio>
      ))}
      {description && <Description>{description}</Description>}
      <FieldError>{message}</FieldError>
    </RadioGroup>
  );
};
