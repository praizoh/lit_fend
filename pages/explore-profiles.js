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
import Sidebar from "../components/sidebar";
import { useRouter } from "next/router";
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
    <div className="search-profiles">
      <Head>
        <meta http-equiv="X-UA-Compatible" content="IE=edge" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Profiles</title>
      </Head>
      <main>
        {/* nav bar */}
        <div className="dasboard explore">
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
          {/* search starts */}
          <div className={cont}>
            <div className={searchContainerStyle}>
              <SearchInput
                placeholder="Search"
                onChange={(e) => setSearchString(e.target.value)}
                value={searchString}
                onKeyDown={handleKeyDown}
              />
              <Button onClick={searchForProfile} buttonText="Search Profiles" />
            </div>
            <div className={listItemContainerStyle}>
              {loadingState === "loading" && <Placeholders number={6} />}
              {profiles.map((profile, index) => (
                <Link href={`/explore-profiles/${profile.id}`} key={index}>
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
                          {trimString(
                            profile.publication?.metadata.content,
                            200
                          )}
                        </p>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
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
      </main>
    </div>
  );
}

const searchContainerStyle = css`
  padding: 40px 0px 30px;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
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
  // display: block;
  margin: 0 auto;
  width: 70%;
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
  border-radius: 14px;
  border: 2px solid rgba(0, 0, 0, 0.04);
  transition: all 0.4s;
  width: 300px;
  background-color: #fafafa;
  &:focus {
    background-color: white;
    border: 2px solid rgba(0, 0, 0, 0.1);
  }
`;
