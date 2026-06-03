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

export const metadata = {
  title: "AirDosa — AI-Powered Instant Dosa Drone Delivery",
  description: "Get piping hot, crispy dosas delivered to your balcony or rooftop via hypersonic AI drones. Authentically prepared on board, dispatched in under 5 minutes.",
  keywords: "AirDosa, drone delivery, AI dosa, instant food delivery, futuristic Indian startup, food tech",
  authors: [{ name: "AirDosa Technologies" }],
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
