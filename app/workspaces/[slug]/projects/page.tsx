import { WorkspaceProjectsClient } from "@/components/workspace-projects-client";

type Props = {
  params: Promise<{
    slug: string;
  }>;
};

export default async function WorkspaceProjectsPage({ params }: Props) {
  const { slug } = await params;
  return <WorkspaceProjectsClient slug={slug} />;
}
