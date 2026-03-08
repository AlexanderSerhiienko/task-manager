"use client";

import { DashboardHeader } from "@/components/features/dashboard/dashboard-header";
import { WorkspaceCreateModal } from "@/components/features/dashboard/workspace-create-modal";
import { WorkspacesList } from "@/components/features/dashboard/workspaces-list";
import { useDashboardController } from "@/components/features/dashboard/hooks/use-dashboard-controller";

type DashboardUser = {
  email?: string | null;
  image?: string | null;
  name?: string | null;
};

type Props = {
  user: DashboardUser | null;
};

export function DashboardClient({ user }: Props) {
  const controller = useDashboardController();

  return (
    <div className="animate-page-enter mx-auto flex w-full flex-col gap-4 py-2 sm:gap-5 sm:py-4">
      <DashboardHeader
        email={user?.email ?? "Signed in user"}
        onCreate={controller.createModal.actions.open}
      />

      <WorkspacesList
        model={controller.workspacesList}
        loading={controller.board.loading}
        errorMessage={controller.board.errorMessage}
      />

      <WorkspaceCreateModal model={controller.createModal} />
    </div>
  );
}
