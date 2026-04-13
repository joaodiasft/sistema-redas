import { PageHeader } from "@/components/admin/page-header";

export function ModuleScaffold({
  title,
  description,
  actions,
  children,
}: {
  title: string;
  description?: string;
  actions?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <>
      <PageHeader title={title} description={description} actions={actions} />
      <div className="flex-1 space-y-6 p-4 sm:p-6 lg:p-8">{children}</div>
    </>
  );
}
