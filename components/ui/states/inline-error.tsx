type Props = {
  message: string;
};

export function InlineError({ message }: Props) {
  return (
    <p
      role="alert"
      aria-live="assertive"
      className="rounded-lg border border-red-800/70 bg-red-950/40 px-3 py-2 text-sm text-red-200"
    >
      {message}
    </p>
  );
}
