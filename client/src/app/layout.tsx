import type { Metadata } from "next";
import { Geist_Mono } from "next/font/google";
import { Outfit } from "next/font/google";
import "./globals.css";

import ContextProvider from "@/context/userContext";
import FolderProvider from "@/context/folderContext";
import EventsProvider from "@/context/eventsContext";
import NotesProvider from "@/context/notesContext";
import ClientWrapper from "./_components/clientWrapper";

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Study Mangement App",
  description: "Application to manage your study materials.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${outfit.variable} ${geistMono.variable} text-gray-800 overflow-x-hidden overflow-y-scroll  bg-gray-300 antialiased`}
      >
        <ContextProvider>
          <FolderProvider>
            <NotesProvider>
              <EventsProvider>
                <ClientWrapper>{children}</ClientWrapper> {/* Use wrapper */}
              </EventsProvider>
            </NotesProvider>
          </FolderProvider>
        </ContextProvider>
      </body>
    </html>
  );
}
