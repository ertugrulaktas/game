import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "LoadOptima AI",
  description: "AI-supported 3D loading optimization and carbon footprint platform"
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
