import "@rainbow-me/rainbowkit/styles.css";
import "../styles/globals.css";
import { getDefaultWallets, RainbowKitProvider } from "@rainbow-me/rainbowkit";
import { chain, configureChains, createClient, WagmiConfig } from "wagmi";
import { alchemyProvider } from "wagmi/providers/alchemy";
import { publicProvider } from "wagmi/providers/public";

const alchemyId = "1AyWRQISqfMYFS0p04G2E9-PX2OsoXxv";
// const alchemyId = process.env.NEXT_PUBLIC_ALCHEMY_ID;
console.log(alchemyId)


const { chains, provider } = configureChains(
  [chain.polygon],
  [alchemyProvider({ apiKey: "CYxON1DoEMJ93sbpAFjE11ePpfuwvaGb", stallTimeout: 1_000, priority: 1 }),
    publicProvider({ priority: 2 })]
);

const { connectors } = getDefaultWallets({
  appName: "lit",
  chains,
});

const wagmiClient = createClient({
  autoConnect: true,
  connectors,
  provider,
});

export default function MyApp({ Component, pageProps }) {
  
  return (
    <WagmiConfig client={wagmiClient}>
      <RainbowKitProvider chains={chains}>
        <Component {...pageProps} />
      </RainbowKitProvider>
    </WagmiConfig>
  );
}
