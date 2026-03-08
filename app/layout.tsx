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
      <body className="min-h-screen">
        <ReactQueryProvider>
          <div className="mx-auto min-h-screen w-full max-w-6xl px-4 py-6 sm:px-6 sm:py-8">
            {children}
          </div>
        </ReactQueryProvider>
      </body>
    </html>
  );
}
