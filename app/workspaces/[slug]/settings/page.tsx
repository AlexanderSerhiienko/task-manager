import { WorkspaceSettingsClient } from "@/components/workspace-settings-client";

type Props = {
  params: Promise<{
    slug: string;
  }>;
};

export default async function WorkspaceSettingsPage({ params }: Props) {
  const { slug } = await params;
  return <WorkspaceSettingsClient slug={slug} />;
}
