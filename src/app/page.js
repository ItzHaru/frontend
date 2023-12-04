import { getClient } from "@/lib/client";
import { gql } from "@apollo/client";
import Link from "next/link";
import {
  ClerkProvider,
  SignedIn,
  SignedOut,
  SignInButton,
  UserButton,
} from "@clerk/nextjs";

// const query = gql`
//   query {
//     categories {
//       data {
//         attributes {
//           Name
//         }
//       }
//     }
//   }
// `;

export default async function Home() {
  // const client = getClient();
  // const { data } = await client.query({ query });

  return (
    <main className="flex min-h-screen flex-col">
      <p>
        <button className="text-5xl pt-10 absolute top-0 right-10 hover:text-[#1d2048] duration-200">
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
            Vítejte ve světě HaruDolore, kde se maturitní příprava stává snadnou
            a efektivní cestou k úspěchu!
          </p>
        </div>
        <div className="flex place-content-center gap-[100px] text-3xl pt-20">
          <Link
            href="subjects/pocitacove-systemy"
            className="whitespace-nowrap border-2 rounded-xl p-5 hover:bg-[#0f112aba] hover:shadow-lg hover:shadow-[#292b45ba] hover:scale-105 duration-300"
          >
            Počítačové systémy
          </Link>
          <Link
            href="subjects/programove-vybaveni"
            className="whitespace-nowrap border-2 rounded-xl p-5 hover:bg-[#0f112aba] hover:shadow-lg hover:shadow-[#292b45ba] hover:scale-105 duration-300"
          >
            Programové vybavení
          </Link>
        </div>
      </div>
    </main>
  );
}
