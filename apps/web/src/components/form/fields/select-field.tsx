"use client";

import { Description, FieldError, Label, ListBox, Select } from "@heroui/react";
import { type FieldProps, useField } from "../context";

export type Option = { id: string; label: string };

export const SelectInput = ({
  label,
  description,
  isDisabled,
  options,
  placeholder = "Select an option",
}: FieldProps & { options: readonly Option[]; placeholder?: string }) => {
  const { field, isInvalid, message } = useField<string>();
  return (
    <Select
      name={field.name}
      value={field.state.value || null}
      onChange={(value) => field.handleChange(String(value ?? ""))}
      onBlur={field.handleBlur}
      isInvalid={isInvalid}
      isDisabled={isDisabled ?? false}
      placeholder={placeholder}
      fullWidth
    >
      <Label>{label}</Label>
      <Select.Trigger>
        <Select.Value />
        <Select.Indicator />
      </Select.Trigger>
      <Select.Popover>
        <ListBox>
          {options.map((option) => (
            <ListBox.Item key={option.id} id={option.id} textValue={option.label}>
              {option.label}
              <ListBox.ItemIndicator />
            </ListBox.Item>
          ))}
        </ListBox>
      </Select.Popover>
      {description && <Description>{description}</Description>}
      <FieldError>{message}</FieldError>
    </Select>
  );
};
