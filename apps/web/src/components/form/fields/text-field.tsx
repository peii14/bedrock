"use client";

import { Description, FieldError, Input, Label, TextArea, TextField } from "@heroui/react";
import { type FieldProps, useField } from "../context";

type TextInputProps = FieldProps & {
  type?: "text" | "email" | "password" | "url" | "tel";
  placeholder?: string;
  multiline?: boolean;
  autoComplete?: string;
};

export const TextInput = ({
  label,
  description,
  isDisabled,
  type = "text",
  placeholder,
  multiline = false,
  autoComplete,
}: TextInputProps) => {
  const { field, isInvalid, message } = useField<string | null>();
  const inputProps = { ...(placeholder && { placeholder }), ...(autoComplete && { autoComplete }) };
  return (
    <TextField
      name={field.name}
      type={type}
      value={field.state.value ?? ""}
      onChange={field.handleChange}
      onBlur={field.handleBlur}
      isInvalid={isInvalid}
      isDisabled={isDisabled ?? false}
      fullWidth
    >
      <Label>{label}</Label>
      {multiline ? <TextArea rows={3} {...inputProps} /> : <Input {...inputProps} />}
      {description && <Description>{description}</Description>}
      <FieldError>{message}</FieldError>
    </TextField>
  );
};
