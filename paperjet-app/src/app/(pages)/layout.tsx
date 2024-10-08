import type { Metadata } from "next";
import "../globals.css";
import { AppSidebar } from "@/components/app-sidebar";
import { SidebarLayout } from "@/components/ui/sidebar";

export const metadata: Metadata = {
  title: "BRBX",
  description: "A BRBX Application.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <SidebarLayout>
          <AppSidebar />
          {children}
        </SidebarLayout>
      </body>
    </html>
  );
}
