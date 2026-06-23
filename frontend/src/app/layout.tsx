import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "HireMind AI | Futuristic Talent Intelligence Platform",
  description: "Transforming recruitment into a continuous, data-driven ecosystem using AI-powered talent DNA analysis.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-[#06050f] text-white antialiased">{children}</body>
    </html>
  );
}
