import { Button } from "@/components/ui/button/button";
import { Modal } from "@/components/ui/modal/modal";
import { InlineError } from "@/components/ui/states/inline-error";

export type MemberAddModalModel = {
  isOpen: boolean;
  values: {
    email: string;
  };
  setters: {
    setEmail: (value: string) => void;
  };
  meta: {
    submitting: boolean;
    submitError: string | null;
  };
  actions: {
    close: () => void;
    onSubmit: (event: React.SubmitEvent<HTMLFormElement>) => void;
  };
};

type Props = {
  model: MemberAddModalModel;
};

export function MemberAddModal({ model }: Props) {
  const { isOpen, values, setters, meta, actions } = model;

  return (
    <Modal title="New member" isOpen={isOpen} onClose={actions.close}>
      <form onSubmit={actions.onSubmit} className="grid gap-4">
        <div className="grid gap-1">
          <label htmlFor="member-email" className="text-sm text-white">
            User email
          </label>
          <input
            id="member-email"
            type="email"
            value={values.email}
            onChange={(event) => setters.setEmail(event.target.value)}
            aria-invalid={meta.submitError !== null}
            required
            className="rounded-lg border border-zinc-700 bg-zinc-900/70 px-3 py-2 text-sm outline-none"
          />
        </div>
        {meta.submitError ? <InlineError message={meta.submitError} /> : null}
        <Button type="submit" disabled={meta.submitting} variant="default" className="w-full sm:w-fit">
          {meta.submitting ? "Creating..." : "Create member"}
        </Button>
      </form>
    </Modal>
  );
}
