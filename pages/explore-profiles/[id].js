/* eslint-disable @next/next/no-img-element */
import Head from "next/head";
import Link from "next/link";

import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import {
  createClient,
  fetchProfile,
  doesFollow as doesFollowQuery,
  createUnfollowTypedData,
  LENS_HUB_CONTRACT_ADDRESS,
} from "../../api_cql";
import { ethers } from "ethers";
import { css } from "@emotion/css";
import ReactMarkdown from "react-markdown";
import { client, GetDefaultProfile } from "../../api";

import LENSHUB from "../../abi/lenshub";

import { BehaviorSubject } from "rxjs";
const profileSubject = new BehaviorSubject(
  process.browser && JSON.parse(localStorage.getItem("profile"))
);
import { useAccount, useSigner } from "wagmi";

export default function Profile() {
  const { address } = useAccount();
  const [profile, setProfile] = useState();
  const [publications, setPublications] = useState([]);
  const [doesFollow, setDoesFollow] = useState();
  const [loadedState, setLoadedState] = useState("");
  const router = useRouter();
  const pathname = router.pathname;

  const { id } = router.query;
  const [userAddress, setUserAddress] = useState("");
  const [userProfile, setUserProfile] = useState();
  const { data: signer } = useSigner({
    onError(error) {
      console.log("Error", error);
    },
  });
  useEffect(() => {
    setUserAddress(address);
    if (!userAddress) {
      return;
    }
    getDefaultProfile();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userAddress]); // eslint-disable-next-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (id) {
      getProfile();
    }
    if (id && userAddress) {
      checkDoesFollow();
    }
  }, [id, userAddress]);

  async function unfollow() {
    try {
      const client = await createClient();
      const response = await client
        .mutation(createUnfollowTypedData, {
          request: { profile: id },
        })
        .toPromise();
      const typedData = response.data.createUnfollowTypedData.typedData;
      const contract = new ethers.Contract(
        typedData.domain.verifyingContract,
        LENSHUB,
        signer
      );
      const tx = await contract.burn(typedData.value.tokenId);
      setTimeout(() => {
        setDoesFollow(false);
      }, 2500);
      await tx.wait();
      console.log(`successfully unfollowed ... ${profile.handle}`);
    } catch (err) {
      console.log("error:", err);
    }
  }

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

  async function getProfile() {
    try {
      const { profile: profileData, publications: publicationData } =
        await fetchProfile(id);
      setProfile(profileData);
      setPublications(publicationData);
      setLoadedState("loaded");
    } catch (err) {
      console.log("error fetching profile...", err);
    }
  }

  async function checkDoesFollow() {
    const urqlClient = await createClient();
    const response = await urqlClient
      .query(doesFollowQuery, {
        request: {
          followInfos: [
            {
              followerAddress: userAddress,
              profileId: id,
            },
          ],
        },
      })
      .toPromise();
    setDoesFollow(response.data.doesFollow[0].follows);
  }

  async function followUser() {
    const contract = new ethers.Contract(
      LENS_HUB_CONTRACT_ADDRESS,
      LENSHUB,
      signer
    );

    try {
      const tx = await contract.follow([id], [0x0]);
      setTimeout(() => {
        setDoesFollow(true);
      }, 2500);
      await tx.wait();
      console.log(`successfully followed ... ${profile.handle}`);
    } catch (err) {
      console.log("error: ", err);
    }
  }

  function editProfile() {
    router.push("/edit-profile");
  }

  if (!profile) return null;

  const profileOwner = userProfile?.id === id;

  return (
    <div className="view-comments">
      <Head>
        <meta http-equiv="X-UA-Compatible" content="IE=edge" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Comments</title>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
        <link
          href="https://fonts.googleapis.com/css2?family=Manrope:wght@200;300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.2.1/css/all.min.css"
        />
      </Head>
      <main>
        <div className="dasboard dashnav">
          {/* nav bar */}
          <div className="navbars">
            <div className="nav">
              <img
                src="../images/Logo.png"
                alt="logo"
                width="32px"
                height="32px"
                className="dashlogo"
              />
              <Link href={`/my-profile`}>
                <div className={"hand"}>
                  <img
                    src="../images/profile-picture.png"
                    alt="profile"
                    width="32px"
                    height="32px"
                    id="side-p"
                  />
                  {/* {ensName && <span>{ensName}</span>}
                {!ensName && <span>{truncateEthAddress(userAddress)}</span>} */}
                </div>
              </Link>
            </div>
            <header>
              <div className="items">
                <div className="taskbar">
                  <Link href={"/dashboard"}>
                    <div className="hand">
                      <li className={pathname === "/dashboard" ? "active" : ""}>
                        <img
                          src="../images/home.png"
                          alt="home icon"
                          className={pathname === "/dashboard" ? "active" : ""}
                        />
                        Home
                      </li>
                    </div>
                  </Link>
                  <Link href={"/explore-profiles"}>
                    <div className="hand">
                      <li
                        className={
                          pathname === "/explore-profiles" ? "active" : ""
                        }
                      >
                        <img
                          src="../images/communities.png"
                          alt="communities icon"
                          className={pathname === "/dashboard" ? "active" : ""}
                        />
                        Profiles
                      </li>
                    </div>
                  </Link>
                  {/* <Link href={"/my-activities"}>
                    <div className="hand">
                      <li
                        className={
                          pathname === "/my-activities" ? "active" : ""
                        }
                      >
                        <img
                          src="../images/activities.png"
                          alt="activities icon"
                          className="sidebarimg"
                        />
                        My Activities
                      </li>
                    </div>
                  </Link> */}
                  <Link href={"/create-post"}>
                    <div className="hand">
                      <li
                        className={pathname === "/create-post" ? "active" : ""}
                      >
                        <img
                          src="../images/create-post.png"
                          alt="create post"
                          className="createpost2"
                        />
                        Create post
                      </li>
                    </div>
                  </Link>
                </div>
              </div>
            </header>
          </div>
          <div className="maincontent grow">
            <div className="content removeMargin">
              <div className={containerStyle}>
                <div
                  className={css`
                    ${headerStyle};
                    background-image: url(${profile.coverPicture?.original
                      .url});
                    background-color: ${profile.color};
                  `}
                ></div>
                <br />
                <div className={columnWrapperStyle}>
                  <div>
                    <img
                      className={css`
                        ${profileImageStyle};
                        background-color: profile.color;
                      `}
                      src={profile.picture?.original?.url}
                    />
                    <h3 className={nameStyle}>{profile.name}</h3>
                    <p className={handleStyle}>{profile.handle}</p>
                    <p className={bioStyle}>{profile.bio}</p>
                    <div>
                      {userAddress && !profileOwner ? (
                        doesFollow ? (
                          <button onClick={unfollow} className={buttonStyle}>
                            Unfollow
                          </button>
                        ) : (
                          <button onClick={followUser} className={buttonStyle}>
                            Follow
                          </button>
                        )
                      ) : null}
                      {profileOwner && (
                        <button onClick={editProfile} className={buttonStyle}>
                          Edit Profile
                        </button>
                      )}
                    </div>
                  </div>
                  <div>
                    <h3 className={postHeaderStyle}>Posts</h3>
                    {publications.map((pub, index) => (
                      <div className={publicationWrapper} key={index}>
                        <ReactMarkdown>{pub.metadata.content}</ReactMarkdown>
                      </div>
                    ))}
                    {loadedState === "loaded" && !publications.length && (
                      <div className={emptyPostContainerStyle}>
                        <p className={emptyPostTextStyle}>
                          <span className={emptyPostHandleStyle}>
                            {profile.handle}
                          </span>{" "}
                          has not posted yet!
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

const bioStyle = css`
  font-weight: 500;
`;

const emptyPostTextStyle = css`
  text-align: center;
  margin: 0;
`;

const emptyPostContainerStyle = css`
  background-color: white;
  border: 1px solid rgba(0, 0, 0, 0.15);
  padding: 25px;
  border-radius: 8px;
`;

const emptyPostHandleStyle = css`
  font-weight: 600;
`;

const postHeaderStyle = css`
  margin: 0px 0px 15px;
`;

const publicationWrapper = css`
  background-color: white;
  margin-bottom: 15px;
  padding: 5px 25px;
  border-radius: 15px;
  border: 1px solid #ededed;
`;

const publicationContentStyle = css`
  line-height: 26px;
`;

const nameStyle = css`
  margin: 15px 0px 5px;
`;

const handleStyle = css`
  margin: 0px 0px 5px;
  color: rgba(80, 47, 138, 1);
`;

const headerStyle = css`
  width: 900px;
  max-height: 300px;
  height: 300px;
  overflow: hidden;
  background-size: cover;
  background-position: center;
  margin: auto;
`;

const profileImageStyle = css`
  width: 200px;
  height: 200px;
  max-width: 200px;
  border: 10px solid white;
  border-radius: 12px;
`;

const columnWrapperStyle = css`
  display: flex;
  flex-direction: row;
  width: 900px;
`;

const rightColumnStyle = css`
  margin-left: 20px;
  flex: 1;
`;

const containerStyle = css`
  padding-top: 50px;
`;

const buttonStyle = css`
  border: 2px solid rgba(80, 47, 138, 1);
  outline: none;
  margin-top: 15px;
  color: rgba(80, 47, 138, 1);
  padding: 13px;
  border-radius: 5px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  transition: all 0.35s;
  font-weight: 700;
  width: 100%;
  letter-spacing: 0.75px;
  &:hover {
    background-color: rgba(80, 47, 138, 1);
    color: white;
  }
`;
