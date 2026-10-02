"use client";

/**
 * App wide TanStack Form hook with HeroUI bound fields.
 * Forms use `useAppForm` + `<form.AppForm><form.Form>` and never wire inputs or submit handling by hand.
 */

import { Button, cn } from "@heroui/react";
import { createFormHook } from "@tanstack/react-form";
import type { ReactNode } from "react";
import { fieldContext, formContext, useFormContext } from "./context";
import { CheckboxInput, RadioInput, SwitchInput } from "./fields/choice-fields";
import { DateInput } from "./fields/date-field";
import { NumberInput } from "./fields/number-field";
import { SelectInput } from "./fields/select-field";
import { TextInput } from "./fields/text-field";

const Form = ({ children, className }: { children: ReactNode; className?: string }) => {
  const form = useFormContext();
  return (
    <form
      noValidate
      className={cn("flex flex-col gap-5", className)}
      onSubmit={(event) => {
        event.preventDefault();
        void form.handleSubmit();
      }}
    >
      {children}
    </form>
  );
};

const SubmitButton = ({
  children,
  isPending = false,
}: {
  children: ReactNode;
  isPending?: boolean;
}) => {
  const form = useFormContext();
  return (
    <form.Subscribe selector={(state) => [state.canSubmit, state.isSubmitting] as const}>
      {([canSubmit, isSubmitting]) => (
        <Button
          type="submit"
          isDisabled={!canSubmit}
          isPending={isSubmitting || isPending}
          fullWidth
        >
          {children}
        </Button>
      )}
    </form.Subscribe>
  );
};

export const { useAppForm } = createFormHook({
  fieldContext,
  formContext,
  fieldComponents: {
    TextInput,
    NumberInput,
    SelectInput,
    CheckboxInput,
    SwitchInput,
    RadioInput,
    DateInput,
  },
  formComponents: { Form, SubmitButton },
});

export type { Option } from "./fields/select-field";
