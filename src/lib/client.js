import createUploadLink from "apollo-upload-client/createUploadLink.mjs";
import {
  NextSSRInMemoryCache,
  NextSSRApolloClient,
} from "@apollo/experimental-nextjs-app-support/ssr";
import { registerApolloClient } from "@apollo/experimental-nextjs-app-support/rsc";

let apolloClient;

export const { getClient } = registerApolloClient(() => {
  const client = new NextSSRApolloClient({
    cache: new NextSSRInMemoryCache(),
    link: createUploadLink({ uri: "http://localhost:1337/graphql" }),
  });

  apolloClient = client;
  return client;
});
