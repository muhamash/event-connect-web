import { Footer } from "@/components/Footer";
import { Navbar } from "@/components/nav/Navbar";
import { Geist, Geist_Mono } from "next/font/google";
import { Toaster } from "react-hot-toast";
import AuthProvider from "../providers/auth.provider";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}> )
{
  // cron.schedule( "*/10 * * * *", () =>
  // {
  //   //  every 10 minutes
  //   console.log( "Running event status update job..." );
  //   updateEventStatus();
  // } );
  
  return (
    <html lang="en">
      <body
        className={`${ geistSans.variable } ${ geistMono.variable } antialiased min-h-screen flex flex-col justify-between bg-background text-foreground  overflow-x-hidden`}
      >
        <AuthProvider>
          <Toaster
            position="top-center"
            reverseOrder={false}
          />
          <Navbar />
          {children}
          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}
