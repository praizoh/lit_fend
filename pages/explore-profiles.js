/* eslint-disable @next/next/no-img-element */
/* eslint-disable @next/next/no-page-custom-font */
import Head from "next/head";
import { useState, useEffect } from "react";
import {
  createClient,
  searchProfiles,
  recommendProfiles,
  getPublications,
} from "../api_cql";
import { css } from "@emotion/css";
import { trimString, generateRandomColor } from "../utils";
import { Button, SearchInput, Placeholders } from "../components";
import Image from "next/image";
import Link from "next/link";
import {
  useAccount,
  useDisconnect,
  useEnsAvatar,
  useEnsName,
  useSigner,
} from "wagmi";
import { ethers, providers } from "ethers";

export default function Home() {
  const [profiles, setProfiles] = useState([]);
  const [loadingState, setLoadingState] = useState("loading");
  const [searchString, setSearchString] = useState("");
  const { address } = useAccount();
  const { data: ensName } = useEnsName({ address });
  const [userAddress, setUserAddress] = useState("");

  // Captures 0x + 4 characters, then the last 4 characters.
  const truncateRegex = /^(0x[a-zA-Z0-9]{4})[a-zA-Z0-9]+([a-zA-Z0-9]{4})$/;

  const truncateEthAddress = (address) => {
    const match = address.match(truncateRegex);
    if (!match) return address;
    return `${match[1]}…${match[2]}`;
  };

  useEffect(() => {
    getRecommendedProfiles();
  }, []);

  async function getRecommendedProfiles() {
    try {
      const urqlClient = await createClient();
      const response = await urqlClient.query(recommendProfiles).toPromise();
      const profileData = await Promise.all(
        response.data.recommendedProfiles.map(async (profile) => {
          const pub = await urqlClient
            .query(getPublications, { id: profile.id, limit: 1 })
            .toPromise();
          profile.publication = pub.data.publications.items[0];
          profile.backgroundColor = generateRandomColor();
          return profile;
        })
      );
      setProfiles(profileData);
      setLoadingState("loaded");
    } catch (err) {
      console.log("error fetching recommended profiles: ", err);
    }
  }

  async function searchForProfile() {
    if (!searchString) return;
    try {
      const urqlClient = await createClient();
      const response = await urqlClient
        .query(searchProfiles, {
          query: searchString,
          type: "PROFILE",
        })
        .toPromise();
      const profileData = await Promise.all(
        response.data.search.items.map(async (profile) => {
          const pub = await urqlClient
            .query(getPublications, { id: profile.profileId, limit: 1 })
            .toPromise();
          profile.id = profile.profileId;
          profile.backgroundColor = generateRandomColor();
          profile.publication = pub.data.publications.items[0];
          return profile;
        })
      );

      setProfiles(profileData);
    } catch (err) {
      console.log("error searching profiles...", err);
    }
  }

  function handleKeyDown(e) {
    if (e.key === "Enter") {
      searchForProfile();
    }
  }

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
        {/* nav bar */}
        <div className="dasboard">
          <div className="nav">
            <img src="images/Logo.png" alt="logo" width="32px" height="32px" />
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

            {/* <div className="side side-bar" id="side-bars"> */}
            {/* <div className="side-head">
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
              </div> */}
            <div className="items">
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
            </div>
          </div>
        </div>
        <div className={cont}>
          <div className={searchContainerStyle}>
            <SearchInput
              placeholder="Search"
              onChange={(e) => setSearchString(e.target.value)}
              value={searchString}
              onKeyDown={handleKeyDown}
            />
            <Button onClick={searchForProfile} buttonText="SEARCH PROFILES" />
          </div>
          <div className={listItemContainerStyle}>
            {loadingState === "loading" && <Placeholders number={6} />}
            {profiles.map((profile, index) => (
              <Link href={`/profile/${profile.id}`} key={index}>
                <div className="hand">
                  <div className={listItemStyle}>
                    <div className={profileContainerStyle}>
                      {profile.picture && profile.picture.original ? (
                        <Image
                          src={profile.picture.original.url}
                          className={profileImageStyle}
                          width="42px"
                          height="42px"
                        />
                      ) : (
                        <div
                          className={css`
                            ${placeholderStyle};
                            background-color: ${profile.backgroundColor};
                          `}
                        />
                      )}

                      <div className={profileInfoStyle}>
                        <h3 className={nameStyle}>{profile.name}</h3>
                        <p className={handleStyle}>{profile.handle}</p>
                      </div>
                    </div>
                    <div>
                      <p className={latestPostStyle}>
                        {trimString(profile.publication?.metadata.content, 200)}
                      </p>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}

const searchContainerStyle = css`
  padding: 40px 0px 30px;
`;

const latestPostStyle = css`
  margin: 23px 0px 5px;
  word-wrap: break-word;
`;

const profileContainerStyle = css`
  display: flex;
  flex-direction: row;
  align-items: flex-start;
`;

const profileImageStyle = css`
  border-radius: 21px;
  width: 42px;
  height: 42px;
`;

const placeholderStyle = css`
  ${profileImageStyle};
`;

const listItemContainerStyle = css`
  display: flex;
  flex-direction: column;
`;

const cont = css`
  display: block;
  margin: 0 auto;
  width: 80%;
`;

const listItemStyle = css`
  background-color: white;
  margin-top: 13px;
  border-radius: 10px;
  border: 1px solid rgba(0, 0, 0, 0.15);
  padding: 21px;
`;

const profileInfoStyle = css`
  margin-left: 10px;
`;

const nameStyle = css`
  margin: 0 0px 5px;
`;

const handleStyle = css`
  margin: 0px 0px 5px;
  color: #b900c9;
`;

const inputStyle = css`
  outline: none;
  border: none;
  padding: 15px 20px;
  font-size: 16px;
  border-radius: 25px;
  border: 2px solid rgba(0, 0, 0, 0.04);
  transition: all 0.4s;
  width: 300px;
  background-color: #fafafa;
  &:focus {
    background-color: white;
    border: 2px solid rgba(0, 0, 0, 0.1);
  }
`;
