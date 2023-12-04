"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  ClerkProvider,
  SignedIn,
  SignedOut,
  SignInButton,
  UserButton,
} from "@clerk/nextjs";

export default function RootLayout({ children }) {
  const pathname = usePathname();
  return (
    <div
      className="grid min-h-screen h-screen text-[#9493b7]"
      style={{
        gridTemplateRows: "70px 1fr",
      }}
    >
      <header>
        <nav className="bg-[#0f112a] border-b-2 relative h-full">
          <ul className="h-full container mx-auto flex relative items-stretchtext-xl">
            <li className="mr-auto">
              <Link href="/">
                <Image
                  className="w-28"
                  src="/images/sspu-white.png"
                  alt="sspu"
                  width={112}
                  height={60}
                />
              </Link>
            </li>
            <li className="place-content-center relative px-5 h-full">
              <Link
                className={`${
                  pathname === "/" ? "border-[#2a2d5a]" : "border-transparent"
                } text-[#E2E8F0] border-b-[6px] hover:border-[#2a2d5a] grid place-content-center duration-100 h-full`}
                href="/"
              >
                Home
              </Link>
            </li>
            <li className="place-content-center relative px-5 h-full">
              <Link
                className={`${
                  pathname.startsWith("/subjects/pocitacove-systemy")
                    ? "border-b border-[#2a2d5a]"
                    : "border-transparent"
                } text-[#E2E8F0] border-b-[6px] hover:border-[#2a2d5a] grid place-content-center duration-100 h-full`}
                href="/subjects/pocitacove-systemy"
              >
                Počítačové systémy
              </Link>
            </li>
            <li className="place-content-center relative px-5 h-full">
              <Link
                className={`${
                  pathname.startsWith("/subjects/programove-vybaveni")
                    ? "border-b border-[#2a2d5a]"
                    : "border-transparent"
                } text-[#E2E8F0] border-b-[6px] hover:border-[#2a2d5a] grid place-content-center duration-100 h-full`}
                href="/subjects/programove-vybaveni"
              >
                Programové vybavení
              </Link>
            </li>
            <li className="place-content-center relative px-5 h-full">
              <Link
                className={`${
                  pathname.startsWith("") ? "" : ""
                } text-[#E2E8F0] hover:text-[#2a2d5a] grid place-content-center duration-150 text-3xl h-full`}
                href=""
              >
                <SignedIn>
                  <UserButton />
                </SignedIn>
                <SignedOut>
                  <SignInButton />
                </SignedOut>
              </Link>
            </li>
          </ul>
        </nav>
      </header>
      <main className="h-full">{children}</main>
      <footer className="bg-[#0f112a] p-6">&copy; 2023 Růženka Perinová</footer>
    </div>
  );
}
