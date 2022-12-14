/* eslint-disable @next/next/no-img-element */

import Head from "next/head";
import { useState, useEffect } from "react";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import Link from "next/link";
import { useRouter } from "next/router";
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
import {
  addressService,
  userService,
  profileService,
} from "../services/userService";
const addressServiceData = addressService;
//   const userAddress = addressServiceData.addressValue

export default function Home() {
  const [posts, setPosts] = useState([]);
  const { address } = useAccount();
  const { data: ensName } = useEnsName({ address });
  const [userAddress, setUserAddress] = useState("");

  useEffect(() => {
    setUserAddress(address);
    fetchPosts();

    if (!userAddress) {
      return;
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userAddress]); // eslint-disable-next-line react-hooks/exhaustive-deps

  // Captures 0x + 4 characters, then the last 4 characters.
  const truncateRegex = /^(0x[a-zA-Z0-9]{4})[a-zA-Z0-9]+([a-zA-Z0-9]{4})$/;

  const truncateEthAddress = (address) => {
    const match = address.match(truncateRegex);
    if (!match) return address;
    return `${match[1]}…${match[2]}`;
  };

  async function fetchPosts() {
    try {
      const response = await client.query(explorePublications).toPromise();
      console.log({ response });
      setPosts(response.data.explorePublications.items);
    } catch (err) {
      console.log(err);
    }
  }
  const router = useRouter();
  return (
    <div className="dasboard">
      <Head>
        <title>Lit dashboard</title>
        <meta name="description" content="Lit-Dapp" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        {/* nav bar */}
        <div className="dashnav">
          <div className="navbars">
            <div className="nav">
              <img
                src="images/Logo.png"
                alt="logo"
                width="32px"
                height="32px"
                className="dashlogo"
              />
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
            </div>
            <Sidebar />
          </div>
          {/* <div className="items">
              <div className="taskbar">
                <Link href={"/dashboard"}>
                  <div className="hand">
                    <li>
                      <img src="images/home.png" alt="home icon" />
                      Home
                    </li>
                  </div>
                </Link>
                <Link href={"/explore-profiles"}>
                  <div className="hand">
                    <li className="side-lists">
                      <img
                        src="images/communities.png"
                        alt="communities icon"
                      />
                      Profiles
                    </li>
                  </div>
                </Link>
                <Link href={"/my-activities"}>
                  <div className="hand">
                    <li className="side-lists">
                      <img src="images/activities.png" alt="activities icon" />
                      My Activities
                    </li>
                  </div>
                </Link>
                <Link href={"/create-post"}>
                  <div className="hand">
                    <li className="side-lists">
                      <img
                        src="images/create-post.png"
                        alt="create post"
                        className="createpost2"
                      />
                      Create post
                    </li>
                  </div>
                </Link>
              </div>
            </div> */}
          {/* </div> */}
          {/* </div> */}

          {/* <!-- story section --> */}
          <div className="maincontent">
            <div id="story">
              <div>
                <div>
                  <img
                    src="images/add-story.png"
                    alt=""
                    width="56px"
                    height="56px"
                  />
                </div>
                <p>Add Story</p>
              </div>
              <div>
                <div>
                  <img
                    src="images/profile-picture.png"
                    className="status"
                    alt=""
                    width="56px"
                    height="56px"
                  />
                </div>
                <p>My Story</p>
              </div>
              <div>
                <div>
                  <img
                    src="images/girl1.png"
                    className="status"
                    alt="cherish"
                    width="56px"
                    height="56px"
                  />
                </div>
                <p>Cherish.eth</p>
              </div>
              <div>
                <div>
                  <img
                    src="images/skeleton.png"
                    className="status"
                    alt=""
                    width="56px"
                    height="56px"
                  />
                </div>
                <p>ntfnow</p>
              </div>
              <div>
                <div>
                  <img
                    src="images/mike.png"
                    className="status"
                    alt=""
                    width="56px"
                    height="56px"
                  />
                </div>
                <p>Mikes Adams</p>
              </div>
              <div>
                <div>
                  <img
                    src="images/cordon.png"
                    className="status"
                    alt=""
                    width="56px"
                    height="56px"
                  />
                </div>
                <p>Cordon</p>
              </div>
            </div>
            {/* <div className="web3post"></div> */}

            {/* <!-- posts section --> */}
            {posts.map((post, index) => (
              <div id="web3" key={index}>
                <div className="webl">
                  <div>
                    {/* { post. */}

                    <img
                      src="images/web3logo.png"
                      alt=""
                      className="status"
                      width="30px"
                      height="30px"
                    />
                    {/* // } */}
                  </div>

                  <p>
                    <span>{post.profile.handle}</span>
                  </p>
                  <img
                    src="images/more_icon.png"
                    alt="more"
                    width="4px"
                    height="24px"
                  />
                </div>
                {/* <!-- <div className="posts"> --> */}
                <Link href={`/posts/${post.id}`} className="hand">
                  <img
                    src="images/web3-polygon.png"
                    className="posts"
                    alt=""
                    height="300px"
                    width="359px"
                  />
                </Link>
                {/* <video >
              <source src={post.metadata.media[0].original.url} type="video/mp4" control width="426px"
              height="300px"/>
            </video> */}
                {/* <!-- </div> --> */}
                <div className="interact">
                  <div className="like">
                    <img
                      src="images/like.png"
                      alt="like"
                      width="20.8px"
                      height="20px"
                    />
                    <img
                      src="images/comments.png"
                      alt="comment"
                      width="20px"
                      height="20px"
                    />
                    <img
                      src="images/share.png"
                      alt="share"
                      width="20px"
                      height="20px"
                    />
                  </div>
                  <div className="dots">
                    <div className="dot active"></div>
                    <div className="dot"></div>
                  </div>
                  <div>
                    <img
                      src="images/save.png"
                      alt=""
                      width="15px"
                      height="20px"
                    />
                  </div>
                </div>
                <div className="liked">
                  <div>
                    <img
                      src="images/liked-by.png"
                      alt=""
                      width="44px"
                      height="20px"
                    />
                  </div>
                  <p>Liked by Zainab and 60 others</p>
                </div>
                <div className="content">
                  <p className="web3cont">{post.profile.name}</p>
                  <p>
                    {post.metadata.content}
                    {/* <span>...Read more</span> */}
                  </p>
                </div>
                {/* <div className="comments">
                <div className="comment">
                  <img
                    src="images/profile-picture.png"
                    alt="profile"
                    width="20px"
                    height="20px"
                  />
                  <p>Add comments</p>
                </div>
                <p className="view">
                  View all {post.stats.totalAmountOfComments} comments
                </p>
              </div> */}
              </div>
            ))}

            {/* task bar */}
            <div className="taskbars mobile">
              {/* post icon */}

              {/* <img
            src="images/create-post.png"
            alt="create post"
            className="createpost"
          /> */}
              <div className="taskbar mobile">
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
        </div>
      </main>
    </div>
  );
}
