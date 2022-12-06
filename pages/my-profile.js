/* eslint-disable @next/next/no-img-element */


import Head from "next/head";
import { useState, useEffect } from "react";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import Link from "next/link";
import Router from "next/router";
import { client, GetDefaultProfile } from "../api";
import {
  useAccount,
  useDisconnect,
  useEnsAvatar,
  useEnsName,
  useSigner,
} from "wagmi";
import {
  addressService,
  userService,
  profileService,
} from "../services/userService";
import { BehaviorSubject } from "rxjs";
const profileSubject = new BehaviorSubject(
  process.browser && JSON.parse(localStorage.getItem("profile"))
);
const addressServiceData = addressService;

export default function Layout() {
  const { address } = useAccount();
  const { data: ensName } = useEnsName({ address });
  const [userAddress, setUserAddress] = useState("");
  const [userProfile, setUserProfile] = useState();

  useEffect(() => {
    console.log(address);
    setUserAddress(address);
    if (!userAddress) {
      return;
    }
    getDefaultProfile();
    // if(!userProfile){
    //   Router.push("/create-profile");
    // }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userAddress]);     // eslint-disable-next-line react-hooks/exhaustive-deps


  // Captures 0x + 4 characters, then the last 4 characters.
  const truncateRegex = /^(0x[a-zA-Z0-9]{4})[a-zA-Z0-9]+([a-zA-Z0-9]{4})$/;

  const truncateEthAddress = (address) => {
    const match = address.match(truncateRegex);
    if (!match) return address;
    return `${match[1]}…${match[2]}`;
  };
  async function getDefaultProfile() {
    try {
      console.log("calling default profile");
      console.log(userAddress);
      const response = await client
        .query(GetDefaultProfile, { address: userAddress })
        .toPromise();
      console.log(response);
      setUserProfile(response.data.defaultProfile);
      profileSubject.next(response.data.defaultProfile);
      localStorage.setItem(
        "profile",
        JSON.stringify(response.data.defaultProfile)
      );
    } catch (err) {
      console.log(err);
    }
  }
  async function routeEditProfile() {
    Router.push("/edit-profile");
  }
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
            <Link href={`/my-profile`}>
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
              <Link href={"/dashboard"}>
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
        {userProfile && (
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
                <h4 className="userprofile">
                  {userProfile.handle}
                  {userProfile.name && <span> || {userProfile.name}</span>}
                </h4>
                <p className="aboutuser">
                  {userProfile.bio
                    ? userProfile.bio
                    : "Web3 babe breaking barriers and building cool stuff @Web3ladies"}
                </p>

                <div className="followers">
                  <p>
                    {userProfile.stats.totalFollowing} <span>Following</span>
                  </p>
                  <p>
                    {userProfile.stats.totalFollowers} <span>Followers</span>
                  </p>
                </div>
                <div className="followers">
                  <p>
                    {userProfile.stats.totalPosts} <span>Posts</span>
                  </p>
                  <p>
                    {userProfile.stats.totalComments} <span>Comments</span>
                  </p>
                </div>
                <button onClick={routeEditProfile}>Edit Profile</button>
              </div>
              {/* <div className="addingpost">
              <img
                src="images/create-post.png"
                alt="create post"
                className="addpost"
              />
              <p>Add Post</p>
            </div> */}
            </main>
          </div>
        )}
      </main>
    </div>
  );
}
