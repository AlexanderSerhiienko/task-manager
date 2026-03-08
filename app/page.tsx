import { auth, signIn } from "@/auth";
import { Button } from "@/components/ui/button/button";
import { redirect } from "next/navigation";

export default async function HomePage() {
  const session = await auth();

  if (session?.user) {
    redirect("/dashboard");
  }

  return (
    <main className="flex min-h-[calc(100vh-48px)] items-center justify-center">
      <section className="w-full max-w-4xl rounded-2xl border border-zinc-800 bg-zinc-950/70 p-8 shadow-2xl backdrop-blur sm:p-10">
        <div className="grid gap-10 md:grid-cols-[1.3fr_1fr] md:items-center">
          <div className="space-y-6">
            <span className="inline-flex rounded-full border border-zinc-700 px-3 py-1 text-xs font-medium uppercase tracking-wider text-zinc-300">
              Task Manager
            </span>
            <div className="space-y-4">
              <h1 className="text-4xl font-bold leading-tight text-white sm:text-5xl">
                Welcome to your workspace hub
              </h1>
              <p className="max-w-xl text-base text-zinc-300 sm:text-lg">
                Plan projects, assign tasks, and keep your team aligned in one clean dashboard.
              </p>
            </div>
            <ul className="grid gap-3 text-sm text-zinc-300 sm:grid-cols-2">
              <li className="rounded-lg border border-zinc-800 bg-zinc-900/60 px-4 py-3">Workspace-first structure</li>
              <li className="rounded-lg border border-zinc-800 bg-zinc-900/60 px-4 py-3">Owner and member roles</li>
              <li className="rounded-lg border border-zinc-800 bg-zinc-900/60 px-4 py-3">Project boards and tasks</li>
              <li className="rounded-lg border border-zinc-800 bg-zinc-900/60 px-4 py-3">Fast, focused team flow</li>
            </ul>
          </div>

          <div className="rounded-xl border border-zinc-800 bg-zinc-900/70 p-6">
            <h2 className="text-xl font-semibold text-white">Sign in</h2>
            <p className="mt-2 text-sm text-zinc-400">Use your Google account to continue to the dashboard.</p>
            <form
              className="mt-6"
              action={async () => {
                "use server";
                await signIn("google", { redirectTo: "/dashboard" });
              }}
            >
              <Button type="submit" variant="default" size="md" className="w-full justify-center py-3 text-base">
                Continue with Google
              </Button>
            </form>
          </div>
        </div>
      </section>
    </main>
  );
}
