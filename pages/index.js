import Head from "next/head";
import { useState, useEffect } from "react";
import { Button, SearchInput, Placeholders } from "../components";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import Link from "next/link";
import Router, { useRouter } from "next/router";
import Sidebar from "../components/sidebar";
import {
  useAccount,
  useDisconnect,
  useEnsAvatar,
  useEnsName,
  useSigner,
} from "wagmi";
import { client, explorePublications } from "../api";
import { ethers, providers } from "ethers";
// import {
//   addressService,
//   userService,
//   profileService,
// } from "../services/userService";
// const addressServiceData = addressService;
export default function Home() {
  const [posts, setPosts] = useState([]);
  const { address } = useAccount();
  const { data: ensName } = useEnsName({ address });
  const [userAddress, setUserAddress] = useState("");

  function login(){
    Router.push('/connect-wallet')
  }

  return (
    <div className="landing-page">
      <Head>
        <title>Lit Landing Page</title>
        <meta name="description" content="Lit-Dapp" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        {/* nav bar */}
        <div className="landing">
          <div className="navbar-land">
            <div className="nav-land">
              <img
                src="images/Logo.png"
                alt="logo"
                width="32px"
                height="32px"
                className="dashlogo"
              />
            </div>
          </div>
          <div className="land-body">
            <div className="land-text">
              <h1>Decentralized Social Media App</h1>
              <p>
                Guarantees anonymity and security in your communication, while
                ensuring you have full control over your data, posts, privacy
                and communications.
              </p>
              <button className="started-btn" onClick={login}>Get Started</button>
            </div>
            <div className="land-image">
              <img src="images/onboarding1.svg" />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
