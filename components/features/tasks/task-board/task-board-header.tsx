import { Button } from "@/components/ui/button/button";

type Props = {
  onCreate: () => void;
};

export function TaskBoardHeader({ onCreate }: Props) {
  return (
    <div className="flex items-center justify-between gap-3">
      <h3 className="text-2xl font-semibold text-zinc-100">Tasks</h3>
      <Button type="button" onClick={onCreate} variant="secondary">
        New task
      </Button>
    </div>
  );
}
