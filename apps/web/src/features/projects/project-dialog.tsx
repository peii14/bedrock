"use client";

import { Modal } from "@heroui/react";
import { type ProjectCreate, projectCreate, projectStatuses } from "@repo/validators";
import { useAppForm } from "@/components/form/form-kit";
import { useResourceMutations } from "@/lib/use-resource-mutations";
import { useUiStore } from "@/stores/ui-store";
import { projectsResource } from "./resource";

const statusOptions = projectStatuses.map((id) => ({
  id,
  label: id[0]?.toUpperCase() + id.slice(1),
}));

const ProjectForm = ({
  initial,
  onSubmit,
}: {
  initial: ProjectCreate;
  onSubmit: (value: ProjectCreate) => Promise<unknown>;
}) => {
  const form = useAppForm({
    defaultValues: initial,
    validators: { onSubmit: projectCreate },
    onSubmit: ({ value }) => onSubmit(value),
  });

  return (
    <form.AppForm>
      <form.Form>
        <form.AppField name="name">{(field) => <field.TextInput label="Name" />}</form.AppField>
        <form.AppField name="description">
          {(field) => <field.TextInput label="Description" multiline />}
        </form.AppField>
        <form.AppField name="status">
          {(field) => <field.SelectInput label="Status" options={statusOptions} />}
        </form.AppField>
        <form.SubmitButton>Save</form.SubmitButton>
      </form.Form>
    </form.AppForm>
  );
};

export const ProjectDialog = () => {
  const dialog = useUiStore((state) => state.projectDialog);
  const close = useUiStore((state) => state.closeProjectDialog);
  const { create, update } = useResourceMutations(projectsResource, "Project");
  const project = dialog.open ? dialog.project : null;

  const save = async (value: ProjectCreate) => {
    if (project) await update.mutateAsync({ id: project.id, body: value });
    else await create.mutateAsync(value);
    close();
  };

  return (
    <Modal isOpen={dialog.open} onOpenChange={(open) => !open && close()}>
      <Modal.Backdrop>
        <Modal.Container>
          <Modal.Dialog>
            <Modal.CloseTrigger />
            <Modal.Header>
              <Modal.Heading>{project ? "Edit project" : "New project"}</Modal.Heading>
            </Modal.Header>
            <Modal.Body>
              <ProjectForm
                key={project?.id ?? "new"}
                initial={{
                  name: project?.name ?? "",
                  description: project?.description ?? "",
                  status: project?.status ?? "active",
                }}
                onSubmit={save}
              />
            </Modal.Body>
          </Modal.Dialog>
        </Modal.Container>
      </Modal.Backdrop>
    </Modal>
  );
};
