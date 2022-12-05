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

export default function Sidebar() {
  const [posts, setPosts] = useState([]);
  const { data: signer, isError, isLoading } = useSigner();
  return (
    <div className="dasboard">
      <Head>
        <title>Lit dashboard</title>
        <meta name="description" content="Lit-Dapp" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <div className="side side-bar" id="side-bars">
          <div className="side-head">
            <div className="side-profile">
              <img
                src="images/profile-picture.png"
                alt="profile"
                width="32px"
                height="32px"
              />
              <p>Zainab.eth</p>
              <img
                src="images/Logo.png"
                alt="logo"
                width="32px"
                height="32px"
                className="side-logo"
                id="side-btn"
              />
            </div>
            <div className="followers">
              <p>
                324 <span>Following</span>
              </p>
              <p>
                1246 <span>Followers</span>
              </p>
            </div>
          </div>
          <div className="items">
            <ul className="ul-items">
              <li className="side-lists">
                <img
                  src="images/profile_icon.png"
                  alt=""
                  width="20px"
                  height="20px"
                />
                <a href="profile .html" className="side-links">
                  Profile
                </a>
              </li>
              <li className="side-lists">
                <img
                  src="images/wallet_icon.png"
                  alt=""
                  width="20px"
                  height="20px"
                />
                <a href="#" className="side-links">
                  {" "}
                  Wallet
                </a>
              </li>
              <li className="side-lists">
                <img
                  src="images/collections.png"
                  alt=""
                  width="18px"
                  height="20px"
                />
                <a href="#" className="side-links">
                  Collections
                </a>
              </li>
              <li className="side-lists">
                <img
                  src="images/settings_icon.png"
                  alt=""
                  width="22px"
                  height="22px"
                />
                <a href="#" className="side-links">
                  Settings
                </a>
              </li>
              <li className="side-lists">
                <img
                  src="images/darkmode_icon.png"
                  alt=""
                  width="22px"
                  height="22px"
                />
                <a href="#" className="side-links">
                  DarkMode
                </a>
              </li>
              <li className="side-lists">
                <img
                  src="images/language_icon.png"
                  alt=""
                  width="22px"
                  height="22px"
                />
                <a href="#" className="side-links">
                  Language
                </a>
              </li>
              <li className="side-lists">
                <img
                  src="images/help_icon.png"
                  alt=""
                  width="20px"
                  height="20px"
                />
                <a href="#" className="side-links">
                  Help Center
                </a>
              </li>
              <li className="side-lists">
                <img
                  src="images/logout_icon.png"
                  alt=""
                  width="18px"
                  height="18px"
                />
                <a href="#" className="side-links">
                  Log Out
                </a>
              </li>
            </ul>
          </div>
        </div>
      </main>
    </div>
  );
}
