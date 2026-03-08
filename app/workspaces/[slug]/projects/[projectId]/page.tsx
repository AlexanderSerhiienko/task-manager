import { WorkspaceProjectClient } from "@/components/workspace-project-client";

type Props = {
  params: Promise<{
    slug: string;
    projectId: string;
  }>;
};

export default async function WorkspaceProjectPage({ params }: Props) {
  const { slug, projectId } = await params;
  return <WorkspaceProjectClient slug={slug} projectId={projectId} />;
}
