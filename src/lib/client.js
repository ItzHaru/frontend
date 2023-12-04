import { HttpLink, ApolloClient } from "@apollo/client";
import {
  NextSSRInMemoryCache,
  NextSSRApolloClient,
} from "@apollo/experimental-nextjs-app-support/ssr";
import { registerApolloClient } from "@apollo/experimental-nextjs-app-support/rsc";

let apolloClient;

export const { getClient } = registerApolloClient(() => {
  const client = new NextSSRApolloClient({
    cache: new NextSSRInMemoryCache(),
    link: new HttpLink({
      uri: "http://localhost:1337/graphql",
    }),
  });

  apolloClient = client;
  return client;
});

export const resetApolloClient = async () => {
  if (apolloClient) {
    await apolloClient.resetStore();
    // nebo použijte apolloClient.clearStore() podle potřeby
  }
};
