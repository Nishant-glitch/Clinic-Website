import * as React from "react";
import { TopBar } from "@/components/layout/TopBar";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { FloatingActions } from "@/components/layout/FloatingActions";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col bg-md-background text-md-on-background antialiased selection:bg-md-primary/20 selection:text-md-primary overflow-x-hidden">
      <TopBar />
      <Header />
      <main className="flex-1 w-full">{children}</main>
      <Footer />
      <FloatingActions />
    </div>
  );
}
