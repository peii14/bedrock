"use client";

import { Button, Chip } from "@heroui/react";
import type { Project } from "@repo/validators";
import { columnHelper } from "@/components/data-table";

const column = columnHelper<Project>();
const dateFormat = new Intl.DateTimeFormat(undefined, { dateStyle: "medium" });

type Actions = { onEdit: (project: Project) => void; onDelete: (project: Project) => void };

export const projectColumns = ({ onEdit, onDelete }: Actions) =>
  column.columns([
    column.accessor("name", { header: "Name" }),
    column.accessor("status", {
      header: "Status",
      enableSorting: false,
      cell: ({ getValue }) => (
        <Chip size="sm" color={getValue() === "active" ? "success" : "default"}>
          {getValue()}
        </Chip>
      ),
    }),
    column.accessor("createdAt", {
      header: "Created",
      cell: ({ getValue }) => dateFormat.format(new Date(getValue())),
    }),
    column.display({
      id: "actions",
      header: "",
      cell: ({ row }) => (
        <div className="flex justify-end gap-2">
          <Button size="sm" variant="secondary" onPress={() => onEdit(row.original)}>
            Edit
          </Button>
          <Button size="sm" variant="danger" onPress={() => onDelete(row.original)}>
            Delete
          </Button>
        </div>
      ),
    }),
  ]);
