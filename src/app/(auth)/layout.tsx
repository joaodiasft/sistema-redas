export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="auth-app-bg relative isolate min-h-dvh px-4 py-10 pt-[max(2.5rem,env(safe-area-inset-top))] pb-[max(2.5rem,env(safe-area-inset-bottom))] pl-[max(1rem,env(safe-area-inset-left))] pr-[max(1rem,env(safe-area-inset-right))] sm:py-14">
      <div
        className="pointer-events-none absolute inset-0 overflow-hidden"
        aria-hidden
      >
        <div className="absolute -left-24 top-0 h-72 w-72 rounded-full bg-[color:var(--admin-accent)]/[0.06] blur-3xl" />
        <div className="absolute -right-20 bottom-0 h-80 w-80 rounded-full bg-[color:var(--admin-accent)]/[0.05] blur-3xl" />
      </div>
      <div className="relative mx-auto flex w-full min-h-[calc(100dvh-5rem)] flex-col items-center justify-center sm:min-h-[calc(100dvh-7rem)]">
        {children}
      </div>
    </div>
  );
}
