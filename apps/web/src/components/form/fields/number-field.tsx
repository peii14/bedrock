"use client";

import { Description, FieldError, Label, NumberField } from "@heroui/react";
import { type FieldProps, useField } from "../context";

export const NumberInput = ({
  label,
  description,
  isDisabled,
  min,
  max,
  step,
}: FieldProps & { min?: number; max?: number; step?: number }) => {
  const { field, isInvalid, message } = useField<number>();
  return (
    <NumberField
      name={field.name}
      value={field.state.value}
      onChange={field.handleChange}
      onBlur={field.handleBlur}
      isInvalid={isInvalid}
      isDisabled={isDisabled ?? false}
      {...(min !== undefined && { minValue: min })}
      {...(max !== undefined && { maxValue: max })}
      {...(step !== undefined && { step })}
      fullWidth
    >
      <Label>{label}</Label>
      <NumberField.Group>
        <NumberField.DecrementButton />
        <NumberField.Input />
        <NumberField.IncrementButton />
      </NumberField.Group>
      {description && <Description>{description}</Description>}
      <FieldError>{message}</FieldError>
    </NumberField>
  );
};
