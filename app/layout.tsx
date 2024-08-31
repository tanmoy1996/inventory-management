import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "@/theme/globals.css";
import SessionProvider from "./SessionProvider";
import { getServerSession } from "next-auth";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import StoreProvider from "./StoreProvider";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v14-appRouter";
import DesignProvider from "./ThemeProvider";
import { ThemeContextProvider } from "@/theme/ThemeContextProvider";
import { Box } from "@mui/material";
import Image from "next/image";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Dashboard",
  description: "Generated by tanmoy barash",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  let session = await getServerSession(authOptions);

  return (
    <html lang="en">
      <body className={inter.className}>
        <AppRouterCacheProvider>
          <ThemeContextProvider>
            <DesignProvider>
              <SessionProvider session={session}>
                <StoreProvider>
                  <>
                    <Box className="w-screen h-screen absolute">
                      <Image
                        fill
                        src="/bg.jpg"
                        alt="background image"
                        loading="lazy"
                        style={{ objectFit: "cover" }}
                      />
                    </Box>
                    <Box className="w-screen h-screen absolute bg-slate-50/60 backdrop-blur-lg"></Box>
                    {children}
                  </>
                </StoreProvider>
              </SessionProvider>
            </DesignProvider>
          </ThemeContextProvider>
        </AppRouterCacheProvider>
      </body>
    </html>
  );
}
