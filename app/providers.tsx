"use client";

import { createAppKit } from "@reown/appkit/react";
import { WagmiProvider } from "wagmi";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { wagmiAdapter } from "@/config/appkit";
import { mainnet } from "@reown/appkit/networks";

const projectId = process.env.NEXT_PUBLIC_PROJECT_ID || "placeholder-project-id";

// Always initialize AppKit (will use placeholder if project ID not set)
createAppKit({
  adapters: [wagmiAdapter],
  projectId,
  networks: [mainnet],
  defaultNetwork: mainnet,
  metadata: {
    name: "Builder Score App",
    description: "Onchain builder score and searcher",
    url: typeof window !== "undefined" ? window.location.origin : "http://localhost:3000",
    icons: [],
  },
  features: {
    swaps: false,
    analytics: false,
  },
  themeMode: "light",
});

const queryClient = new QueryClient();

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <WagmiProvider config={wagmiAdapter.wagmiConfig}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </WagmiProvider>
  );
}

