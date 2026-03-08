import { WorkspaceShellClient } from "@/components/workspace-shell-client";

type Props = {
  children: React.ReactNode;
  params: Promise<{
    slug: string;
  }>;
};

export default async function WorkspaceLayout({ children, params }: Props) {
  const { slug } = await params;
  return <WorkspaceShellClient slug={slug}>{children}</WorkspaceShellClient>;
}
