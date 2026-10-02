import { projectListQuery } from "@repo/validators";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import type { Metadata } from "next";
import { ProjectsView } from "@/features/projects/projects-view";
import { createProjectsResource } from "@/features/projects/resource";
import { requestCookie, serverApi } from "@/lib/api.server";
import { getQueryClient } from "@/lib/query-client";

export const metadata: Metadata = { title: "Projects" };

type PageProps = { searchParams: Promise<Record<string, string>> };

const ProjectsPage = async ({ searchParams }: PageProps) => {
  const query = projectListQuery.parse(await searchParams);
  const queryClient = getQueryClient();
  await queryClient.prefetchQuery(
    createProjectsResource(serverApi(await requestCookie())).list(query),
  );

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <ProjectsView />
    </HydrationBoundary>
  );
};

export default ProjectsPage;
