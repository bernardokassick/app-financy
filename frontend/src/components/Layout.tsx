import { Toaster } from "@/components/ui/sonner";

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen bg-gray-100">
      <Toaster position="bottom-right" expand={true} richColors />
      <main className="mx-auto px-16 py-8">
        {children}
      </main>
    </div>
  );
}