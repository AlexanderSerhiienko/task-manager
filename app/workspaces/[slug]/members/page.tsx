import { WorkspaceMembersClient } from "@/components/workspace-members-client";

type Props = {
  params: Promise<{
    slug: string;
  }>;
};

export default async function WorkspaceMembersPage({ params }: Props) {
  const { slug } = await params;
  return <WorkspaceMembersClient slug={slug} />;
}
