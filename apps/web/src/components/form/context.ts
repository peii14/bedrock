"use client";

import { createFormHookContexts } from "@tanstack/react-form";

export const { fieldContext, formContext, useFieldContext, useFormContext } =
  createFormHookContexts();

/** Field state every input needs: the field, whether to show an error, and the message. */
export const useField = <T>() => {
  const field = useFieldContext<T>();
  const { errors, isTouched, isValid } = field.state.meta;
  const message = errors
    .map((error: unknown) =>
      typeof error === "string" ? error : (error as { message?: string } | undefined)?.message,
    )
    .filter(Boolean)
    .join(", ");
  return { field, isInvalid: isTouched && !isValid, message };
};

export type FieldProps = { label: string; description?: string; isDisabled?: boolean };
