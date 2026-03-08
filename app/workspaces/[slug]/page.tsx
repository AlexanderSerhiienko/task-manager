import { WorkspaceOverviewClient } from "@/components/workspace-overview-client";

type Props = {
  params: Promise<{
    slug: string;
  }>;
};

export default async function WorkspacePage({ params }: Props) {
  const { slug } = await params;
  return <WorkspaceOverviewClient slug={slug} />;
}
