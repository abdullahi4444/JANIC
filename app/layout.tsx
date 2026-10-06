import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "JANIC | Jazeera Nexus Innovation Center — Jazeera University",
    template: "%s | JANIC",
  },
  description:
    "Jazeera Nexus Innovation Center (JANIC), Faculty of Computer Science & IT at Jazeera University. Technology, Innovation, Research, and Professional Training.",
  keywords: [
    "JANIC",
    "Jazeera Nexus Innovation Center",
    "Jazeera University",
    "Somalia Innovation",
    "Tech Hub Mogadishu",
    "Student Innovation",
    "Applied Research",
    "ICT Training",
    "Robotics",
    "AI",
  ],
  authors: [{ name: "Jazeera University - Faculty of Computer Science & IT" }],
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"),
  icons: {
    icon: "/images/janic-logo-blue.png",
    apple: "/images/janic-logo-blue.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full antialiased scroll-smooth">
      <body className="min-h-full flex flex-col bg-white text-slate-900 font-sans selection:bg-blue-600 selection:text-white">
        {children}
      </body>
    </html>
  );
}
