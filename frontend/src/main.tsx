import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { App } from './App.tsx'
import { BrowserRouter } from "react-router-dom"
import { ApolloProvider } from "@apollo/client/react"
import { apolloClient } from "./lib/graphql/apollo.ts"
import { Toaster } from './components/ui/sonner.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ApolloProvider client={apolloClient}>
      <BrowserRouter>
        <Toaster richColors closeButton />
        <App />
      </BrowserRouter>
    </ApolloProvider>
  </StrictMode>
)