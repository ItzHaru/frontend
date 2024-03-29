import "./globals.css";
import { Albert_Sans } from "next/font/google";
import { ApolloWrapper } from "@/components/ApolloClientWrapper";
import { ClerkProvider } from "@clerk/nextjs";
import { dark } from "@clerk/themes";

const albert = Albert_Sans({
  subsets: ["latin"],
  weight: ["200", "500", "700", "800", "900"],
});

export const metadata = {
  title: "HaruDolore",
  description:
    "Webová aplikace HaruDolore, která umožňuje ukládání a správu výukových materiálů.",
};

export default function RootLayout({ children }) {
  return (
    <ClerkProvider
      appearance={{
        baseTheme: dark,
      }}
    >
      <html lang="en">
        <body className={albert.className}>
          <ApolloWrapper>{children}</ApolloWrapper>
        </body>
      </html>
    </ClerkProvider>
  );
}
