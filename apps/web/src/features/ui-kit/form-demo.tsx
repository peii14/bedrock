"use client";

import { toast } from "@heroui/react";
import { z } from "zod";
import { type Option, useAppForm } from "@/components/form/form-kit";

const roles: Option[] = [
  { id: "engineer", label: "Engineer" },
  { id: "designer", label: "Designer" },
  { id: "manager", label: "Manager" },
];

const plans: Option[] = [
  { id: "free", label: "Free" },
  { id: "team", label: "Team" },
  { id: "enterprise", label: "Enterprise" },
];

const schema = z.object({
  name: z.string().trim().min(1, "Name is required"),
  email: z.email("Enter a valid email"),
  bio: z.string().max(200, "Keep it under 200 characters"),
  role: z.string().min(1, "Pick a role"),
  plan: z.string().min(1, "Pick a plan"),
  seats: z.number().int().min(1, "At least 1 seat").max(100, "At most 100 seats"),
  startDate: z.string().nullable().refine(Boolean, "Pick a start date"),
  newsletter: z.boolean(),
  terms: z.boolean().refine(Boolean, "Accept the terms to continue"),
});

const defaults: z.input<typeof schema> = {
  name: "",
  email: "",
  bio: "",
  role: "",
  plan: "team",
  seats: 5,
  startDate: null,
  newsletter: true,
  terms: false,
};

export const FormDemo = () => {
  const form = useAppForm({
    defaultValues: defaults,
    validators: { onChange: schema },
    onSubmit: async ({ value }) => {
      await new Promise((resolve) => setTimeout(resolve, 600));
      toast.success(`Saved ${value.name}, ${value.seats} seats on ${value.plan}`);
    },
  });

  return (
    <form.AppForm>
      <form.Form className="grid gap-5 md:grid-cols-2">
        <form.AppField name="name">{(f) => <f.TextInput label="Name" />}</form.AppField>
        <form.AppField name="email">
          {(f) => <f.TextInput label="Email" type="email" placeholder="you@company.com" />}
        </form.AppField>
        <form.AppField name="role">
          {(f) => <f.SelectInput label="Role" options={roles} />}
        </form.AppField>
        <form.AppField name="seats">
          {(f) => <f.NumberInput label="Seats" min={1} max={100} />}
        </form.AppField>
        <form.AppField name="startDate">{(f) => <f.DateInput label="Start date" />}</form.AppField>
        <form.AppField name="plan">
          {(f) => <f.RadioInput label="Plan" options={plans} />}
        </form.AppField>
        <div className="md:col-span-2">
          <form.AppField name="bio">
            {(f) => <f.TextInput label="Bio" multiline description="Shown on your profile." />}
          </form.AppField>
        </div>
        <form.AppField name="newsletter">
          {(f) => <f.SwitchInput label="Product updates by email" />}
        </form.AppField>
        <form.AppField name="terms">
          {(f) => <f.CheckboxInput label="I accept the terms" />}
        </form.AppField>
        <div className="md:col-span-2 md:w-48">
          <form.SubmitButton>Save</form.SubmitButton>
        </div>
      </form.Form>
    </form.AppForm>
  );
};
