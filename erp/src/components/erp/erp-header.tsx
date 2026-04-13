export function ErpHeader({ titulo }: { titulo: string }) {
  return (
    <header className="flex h-14 items-center border-b border-zinc-200 bg-white px-6">
      <h1 className="text-lg font-semibold text-zinc-900">{titulo}</h1>
    </header>
  );
}
