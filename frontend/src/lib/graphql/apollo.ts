import { useAuthStore } from "../../stores/auth";
import { ApolloClient, HttpLink, ApolloLink, InMemoryCache } from "@apollo/client";
import { SetContextLink  } from "@apollo/client/link/context";
import { ErrorLink } from "@apollo/client/link/error";
 import {
   CombinedGraphQLErrors,
   CombinedProtocolErrors,
 } from "@apollo/client/errors";
import { toast } from "sonner";

const httpLink = new HttpLink({
  uri: import.meta.env.VITE_BACKEND_URL
});

const errorLink = new ErrorLink(({ error }) => {
  if (CombinedGraphQLErrors.is(error)) {
    error.errors.forEach(({ message, locations, path, extensions }) => {
      console.log(
        `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`
      );

      if (message === "Not authenticated" || extensions?.code === "UNAUTHENTICATED") {
        
        toast.error("Sessão expirada", {
          description: "Sua sessão expirou. Por favor, faça login novamente."
        });

        useAuthStore.getState().logout();
      }
    });
  } else if (CombinedProtocolErrors.is(error)) {
      error.errors.forEach(({ message, extensions }) =>

       console.log(

         `[Protocol error]: Message: ${message}, Extensions: ${JSON.stringify(

           extensions

         )}`

       )

     );
  } else {
    console.error(`[Network error]: ${error}`);
  }
});

const authLink = new SetContextLink((prevContext) => {
  const token = useAuthStore.getState().token
  return {
    headers: {
      ...prevContext.headers,
      authorization: token ? `Bearer ${token}` : "",
    },
  };
});

export const apolloClient = new ApolloClient({
  link: ApolloLink.from([
    errorLink,
    authLink,
    httpLink
  ]),
  cache: new InMemoryCache()
});