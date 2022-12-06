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

export default function ProfilePage() {
  const [posts, setPosts] = useState([]);
  //   const { data: signer, isError, isLoading } = useSigner();
  return (
    <div className="profile-page">
      <Head>
        <title> Profile Page</title>
        <meta name="description" content="Lit-Dapp" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <div className="profilep">
          <img
            src="images/profile-picture.png"
            alt="profile"
            width="45px"
            height="45px"
          />
          <h4 className="userprofile">Zainab.eth</h4>
          <p className="aboutuser">
            Web3 babe breaking barriers and building cool stuff @Web3ladies
          </p>

          <div className="followers">
            <p>
              324 <span>Following</span>
            </p>
            <p>
              1246 <span>Followers</span>
            </p>
          </div>
        </div>
        <div></div>
        <div className="addingpost">
          <img
            src="images/create-post.png"
            alt="create post"
            className="addpost"
          />
          <p>Add Post</p>
        </div>
      </main>
    </div>
  );
}
