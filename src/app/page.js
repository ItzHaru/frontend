import Link from "next/link";
import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";

export default async function Home() {
  return (
    <main className="flex min-h-screen flex-col main">
      <div className="center">
        <p>
          <button className="text-3xl pt-10 absolute top-0 right-10 hover:text-[#322656] duration-200">
            <SignedIn>
              <UserButton />
            </SignedIn>
            <SignedOut>
              <SignInButton />
            </SignedOut>
          </button>
        </p>
        <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <div>
            <h1 className="text-white text-center text-7xl font-bold">
              HaruDolore
            </h1>
            <p className="text-center mt-10">
              Vítejte na stránce HaruDolore, kde si můžete efektivně ukládat a
              spravovat vaše výukové materiály.
            </p>
          </div>
          <div className="flex place-content-center gap-[100px] text-3xl pt-20">
            <Link
              href="subjects/pocitacove-systemy"
              className="whitespace-nowrap border-2 rounded-xl p-5 hover:bg-[#090518d4] hover:shadow-lg hover:shadow-[#312945ba] hover:scale-105 duration-300"
            >
              Počítačové systémy
            </Link>
            <Link
              href="subjects/programove-vybaveni"
              className="whitespace-nowrap border-2 rounded-xl p-5 hover:bg-[#090518d4] hover:shadow-lg hover:shadow-[#312945ba] hover:scale-105 duration-300"
            >
              Programové vybavení
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
