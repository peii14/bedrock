"use client";

import { Button, SearchField } from "@heroui/react";
import { type Project, projectListQuery } from "@repo/validators";
import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import { DataTable } from "@/components/data-table";
import { Typography } from "@/components/ui/typography";
import { useListParams } from "@/lib/list-params";
import { useResourceMutations } from "@/lib/use-resource-mutations";
import { useUiStore } from "@/stores/ui-store";
import { projectColumns } from "./columns";
import { ProjectDialog } from "./project-dialog";
import { projectsResource } from "./resource";

export const ProjectsView = () => {
  const [query, setQuery] = useListParams(projectListQuery);
  const { data, isFetching } = useQuery(projectsResource.list(query));
  const { remove } = useResourceMutations(projectsResource, "Project");
  const openDialog = useUiStore((state) => state.openProjectDialog);

  const columns = useMemo(
    () =>
      projectColumns({
        onEdit: openDialog,
        onDelete: (project: Project) => {
          if (window.confirm(`Delete "${project.name}"?`)) remove.mutate(project.id);
        },
      }),
    [openDialog, remove.mutate],
  );

  return (
    <section className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Typography as="h1" variant="j2" font="secondary">
          Projects
        </Typography>
        <div className="flex items-center gap-2">
          <SearchField
            aria-label="Search projects"
            defaultValue={query.search ?? ""}
            onSubmit={(search) => setQuery({ search })}
            onClear={() => setQuery({ search: undefined })}
          >
            <SearchField.Group>
              <SearchField.SearchIcon />
              <SearchField.Input placeholder="Search" />
              <SearchField.ClearButton />
            </SearchField.Group>
          </SearchField>
          <Button onPress={() => openDialog()}>New project</Button>
        </div>
      </div>
      <DataTable
        label="Projects"
        columns={columns}
        data={data?.items ?? []}
        total={data?.total ?? 0}
        query={query}
        onQueryChange={setQuery}
        isLoading={isFetching}
      />
      <ProjectDialog />
    </section>
  );
};
