import type { Metadata, Viewport } from "next";
import { Rozha_One, Mukta } from "next/font/google";
import "./globals.css";

// Rozha One: high-contrast Devanagari display — the weight of a mandal banner.
const rozha = Rozha_One({
  weight: "400",
  subsets: ["devanagari", "latin"],
  variable: "--font-rozha",
  display: "swap",
});

// Mukta: quiet humanist for everything the display face shouldn't touch.
const mukta = Mukta({
  weight: ["300", "400", "500", "600"],
  subsets: ["devanagari", "latin"],
  variable: "--font-mukta",
  display: "swap",
});

export const metadata: Metadata = {
  title: "गणपती बाप्पा मोरया — the pandal, all year",
  description:
    "A sarvajanik Ganpati pandal you can stand in front of any day of the year: the aarti set, the DJ set, the visarjan set, and a dhol-tasha pathak playing live in your browser.",
  openGraph: {
    title: "गणपती बाप्पा मोरया",
    description: "ढोल वाजतोय · गुलाल उडतोय · गल्ली नाचतेय",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#0d0819",
  colorScheme: "dark",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="mr">
      <body className={`${rozha.variable} ${mukta.variable}`}>{children}</body>
    </html>
  );
}
