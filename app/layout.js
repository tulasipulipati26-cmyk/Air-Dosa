import { Outfit, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

const outfit = Outfit({
  subsets: ["latin"],
  weight: ["300", "400", "600", "700", "800"],
  variable: "--font-display",
});

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-body",
});

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ??
  (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000");

export const metadata = {
  metadataBase: new URL(siteUrl),
  title: "AirDosa — AI-Powered Instant Dosa Drone Delivery",
  description:
    "Get piping hot, crispy dosas delivered to your balcony or rooftop via hypersonic AI drones. Authentically prepared on board, dispatched in under 5 minutes.",
  keywords: "AirDosa, drone delivery, AI dosa, instant food delivery, futuristic Indian startup, food tech",
  authors: [{ name: "AirDosa Technologies" }],
  openGraph: {
    title: "AirDosa — AI-Powered Instant Dosa Drone Delivery",
    description:
      "Get piping hot, crispy dosas delivered to your balcony or rooftop via hypersonic AI drones. Authentically prepared on board, dispatched in under 5 minutes.",
    url: siteUrl,
    siteName: "AirDosa",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: "AirDosa — AI-Powered Instant Dosa Drone Delivery",
      },
      {
        url: "/og-image.svg",
        width: 1200,
        height: 630,
        alt: "AirDosa — AI-Powered Instant Dosa Drone Delivery",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "AirDosa — AI-Powered Instant Dosa Drone Delivery",
    description:
      "Get piping hot, crispy dosas delivered to your balcony or rooftop via hypersonic AI drones. Authentically prepared on board, dispatched in under 5 minutes.",
    images: ["/opengraph-image", "/og-image.svg"],
  },
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${outfit.variable} ${plusJakartaSans.variable}`}>
        {children}
      </body>
    </html>
  );
}
