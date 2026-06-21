import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "HireMind AI | Futuristic Talent Intelligence Platform",
  description: "Transforming recruitment into a continuous, data-driven ecosystem.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
