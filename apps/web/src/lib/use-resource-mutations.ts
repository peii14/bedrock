"use client";

/** Create, update and remove mutations for any resource; each one refreshes the resource's queries. */

import { toast } from "@heroui/react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { Resource } from "./resource";

export const useResourceMutations = <TItem, TQuery, TCreate, TUpdate>(
  resource: Resource<TItem, TQuery, TCreate, TUpdate>,
  label: string,
) => {
  const queryClient = useQueryClient();
  const options = (success: string) => ({
    onSuccess: () => {
      toast.success(success);
      return queryClient.invalidateQueries({ queryKey: resource.keys.all });
    },
    onError: (error: Error) => toast.danger(error.message),
  });

  return {
    create: useMutation({ mutationFn: resource.endpoints.create, ...options(`${label} created`) }),
    update: useMutation({
      mutationFn: ({ id, body }: { id: string; body: TUpdate }) =>
        resource.endpoints.update(id, body),
      ...options(`${label} updated`),
    }),
    remove: useMutation({ mutationFn: resource.endpoints.remove, ...options(`${label} deleted`) }),
  };
};
