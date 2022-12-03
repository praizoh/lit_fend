import Head from "next/head";
import { useState, useEffect } from "react";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import {
  useAccount,
  useDisconnect,
  useEnsAvatar,
  useEnsName,
  useSigner,
} from "wagmi";
import { client, explorePublications } from "../api";

export default function Createprofile() {
  const [posts, setPosts] = useState([]);
  const { data: signer, isError, isLoading } = useSigner();
  return (
    <div className="createprofile">
      <Head>
        <title>Lit Profile</title>
        <meta name="description" content="Lit-Dapp" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <div className="cprofile">
          <img
            src="images/Logo.png"
            alt="logo"
            width="32px"
            height="32px"
            className="clogo"
          />
          <h3>Welcome To Lit</h3>
          <p>Create your account to get started with Lit</p>
          <input
            type="file"
            id="cimage"
            accept="image/*"
            placeholder="add profile picture"
            className="imagep"
          ></input>
          {/* <img */}
          {/* src="images/add-story.png"
              alt="add picture"
              width="70px"
              height="70px"
              className="addpicture"
            /> */}

          <input type="text" placeholder="User name"></input>
          <button>Create Profile</button>
          <p className="cuser">
            Already have an account? <a href="index.js">Log in</a>
          </p>
        </div>
      </main>
    </div>
  );
}
