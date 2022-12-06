import Head from "next/head";
import { useState, useEffect } from "react";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import Link from 'next/link'
import {
  useAccount,
  useDisconnect,
  useEnsAvatar,
  useEnsName,
  useSigner,
} from "wagmi";
import { client, explorePublications } from "../../api";
import { ethers, providers } from 'ethers'
import { addressService,userService, profileService } from "../userService";
const addressServiceData = addressService

export default function Layout() {
  const { address } = useAccount();
  const { data: ensName } = useEnsName({ address });
  const [userAddress, setUserAddress] = useState("");


  useEffect(() => {
    setUserAddress(address)
  }, [userAddress]);


  // Captures 0x + 4 characters, then the last 4 characters.
  const truncateRegex = /^(0x[a-zA-Z0-9]{4})[a-zA-Z0-9]+([a-zA-Z0-9]{4})$/;

  const truncateEthAddress = (address) => {
    const match = address.match(truncateRegex);
    if (!match) return address;
    return `${match[1]}…${match[2]}`;
  };

  return (
    <div>
      <Head>
        <title>Lit dashboard</title>
        <meta name="description" content="Lit-Dapp" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        {/* nav bar */}
        <div className="dasboard">
            <div className="nav">
            <Link href={`/my-profile`} >
            <div className={"hand"}>
              <img
                src="images/profile-picture.png"
                alt="profile"
                width="32px"
                height="32px"
                id="side-p"
              />
              {ensName && <span>{ensName}</span>}
              {!ensName && <span>{truncateEthAddress(userAddress)}</span>}
            </div>
          </Link>
            <img src="images/Logo.png" alt="logo" width="32px" height="32px" />
            </div>
        </div>
        <div></div>
        <div className="dasboard">
            {/* task bar */}
            <div className="taskbars">
            {/* post icon */}

            {/* <img
                src="images/create-post.png"
                alt="create post"
                className="createpost"
            /> */}
            <div className="taskbar">
            <Link href={'/dashboard'}>
              <div className="hand">
                <img src="images/home.png" alt="home icon" />
                <p>Home</p>
              </div>
            </Link>
            <Link href={"/explore-profiles"}>
              <div className="hand">
                <img src="images/communities.png" alt="communities icon" />
                <p>Profiles</p>
              </div>
            </Link>
            <Link href={"/my-activities"}>
              <div className="hand">
                <img src="images/activities.png" alt="activities icon" />
                <p>My Activities</p>
              </div>
            </Link>
            <Link href={"/create-post"}>
              <div className="hand">
              <img
                src="images/create-post.png"
                alt="create post"
                className="createpost2"
              />
                <p>Create Post</p>
              </div>
            </Link>
          </div>
            </div>
        </div>
      </main>
    </div>
  );
}
