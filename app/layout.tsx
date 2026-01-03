import type { Metadata } from "next";
import { Noto_Sans } from "next/font/google";
import "./globals.css";

const notoSans = Noto_Sans({
    subsets: ["latin"],
    weight: ["400", "500", "600", "700"],
    variable: "--font-noto-sans",
    display: "swap",
});



export const metadata: Metadata = {
    title: "MUAZ WRAPPED IT | Your AI Assistant",
    description: "Ask anything, get instant answers. Powered by advanced AI technology.",
    keywords: ["AI", "Assistant", "API", "Gemini", "Chat", "MUAZ WRAPPED IT"],
    authors: [{ name: "MUAZ" }],
    openGraph: {
        title: "MUAZ WRAPPED IT | Your AI Assistant",
        description: "Ask anything, get instant answers.",
        type: "website",
    },
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en" className={notoSans.variable}>
            <body className="antialiased font-sans">
                {children}
            </body>
        </html>
    );
}
