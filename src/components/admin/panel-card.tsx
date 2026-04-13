export function PanelCard({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`rounded-2xl border border-zinc-100 bg-white p-5 shadow-sm shadow-zinc-200/40 ${className}`}
    >
      {children}
    </div>
  );
}
