import "./globals.css";
import { ReactQueryProvider } from "@/components/providers/react-query-provider";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Task Manager",
  description: "Workspace-based task manager for teams",
};

type RootLayoutProps = {
  children: React.ReactNode;
};

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en">
      <body className="min-h-dvh">
        <ReactQueryProvider>
          <div className="mx-auto min-h-dvh w-full max-w-7xl px-3 py-4 sm:px-6 sm:py-8 lg:px-8">
            {children}
          </div>
        </ReactQueryProvider>
      </body>
    </html>
  );
}
