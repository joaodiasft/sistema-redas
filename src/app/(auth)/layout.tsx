export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative min-h-screen bg-[#f4f2f5] px-4 py-10 sm:py-14">
      <div
        className="pointer-events-none absolute inset-0 overflow-hidden"
        aria-hidden
      >
        <div className="absolute -left-24 top-0 h-72 w-72 rounded-full bg-[#d81b60]/[0.06] blur-3xl" />
        <div className="absolute -right-20 bottom-0 h-80 w-80 rounded-full bg-[#d81b60]/[0.05] blur-3xl" />
      </div>
      <div className="relative mx-auto flex min-h-[calc(100vh-5rem)] flex-col items-center justify-center sm:min-h-[calc(100vh-7rem)]">
        {children}
      </div>
    </div>
  );
}
