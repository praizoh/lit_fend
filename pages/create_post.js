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
  // const { data: signer, isError, isLoading } = useSigner();
  return (
    <div className="postpage">
      <Head>
        <title> Post Page</title>
        <meta name="description" content="Lit-Dapp" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <div className="container">
          <div className="headerlogo">
            <img src="images/Logo.png" alt="logo" className="postpagelogo" />
          </div>
          <hr></hr>
          <div className="wrapper">
            <div className="post">
              <form action="#">
                <div className="content">
                  <img src="images/profile-picture.png" alt="" />
                  <p>Zainab.eth</p>
                </div>
                <textarea
                  placeholder="What's on your mind?"
                  spellcheck="false"
                  cols="20"
                  rows="7"
                  required
                ></textarea>
                <button>
                  <img
                    src="images/add-story.png"
                    alt="add picture"
                    width="30px"
                    height="30px"
                    className="postpicture"
                  />
                  &nbsp; Add a Picture
                </button>
                <input
                  type="file"
                  accept="image/*"
                  placeholder="add profile picture"
                  id="postp"
                ></input>

                <button>Post</button>
              </form>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
