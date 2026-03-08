import { Button } from "@/components/ui/button/button";

type Props = {
  onCreate: () => void;
};

export function TaskBoardHeader({ onCreate }: Props) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <h3 className="text-xl font-semibold text-zinc-100 sm:text-2xl">Tasks</h3>
      <Button type="button" onClick={onCreate} variant="secondary" className="w-full sm:w-auto">
        New task
      </Button>
    </div>
  );
}
