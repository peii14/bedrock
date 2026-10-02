"use client";

/** Date input bound to an ISO `YYYY-MM-DD` string, so form values stay plain JSON. */

import { Calendar, DateField, DatePicker, Description, FieldError, Label } from "@heroui/react";
import { parseDate } from "@internationalized/date";
import { type FieldProps, useField } from "../context";

const toDate = (value: string | null | undefined) => {
  try {
    return value ? parseDate(value) : null;
  } catch {
    return null;
  }
};

export const DateInput = ({ label, description, isDisabled }: FieldProps) => {
  const { field, isInvalid, message } = useField<string | null>();
  return (
    <DatePicker
      name={field.name}
      value={toDate(field.state.value)}
      onChange={(value) => field.handleChange(value ? value.toString() : null)}
      onBlur={field.handleBlur}
      isInvalid={isInvalid}
      isDisabled={isDisabled ?? false}
    >
      <Label>{label}</Label>
      <DateField.Group>
        <DateField.Input>{(segment) => <DateField.Segment segment={segment} />}</DateField.Input>
        <DateField.Suffix>
          <DatePicker.Trigger>
            <DatePicker.TriggerIndicator />
          </DatePicker.Trigger>
        </DateField.Suffix>
      </DateField.Group>
      {description && <Description>{description}</Description>}
      <FieldError>{message}</FieldError>
      <DatePicker.Popover>
        <Calendar aria-label={label}>
          <Calendar.Header>
            <Calendar.NavButton slot="previous" />
            <Calendar.Heading />
            <Calendar.NavButton slot="next" />
          </Calendar.Header>
          <Calendar.Grid>
            <Calendar.GridHeader>
              {(day) => <Calendar.HeaderCell>{day}</Calendar.HeaderCell>}
            </Calendar.GridHeader>
            <Calendar.GridBody>{(date) => <Calendar.Cell date={date} />}</Calendar.GridBody>
          </Calendar.Grid>
        </Calendar>
      </DatePicker.Popover>
    </DatePicker>
  );
};
