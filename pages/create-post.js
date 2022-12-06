import Head from "next/head";
import { useState, useEffect } from "react";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import Link from "next/link";
import {
  useAccount,
  useDisconnect,
  useEnsAvatar,
  useEnsName,
  useSigner,
} from "wagmi";
import { ethers, providers } from "ethers";
import {
  addressService,
  userService,
  profileService,
} from "../services/userService";
const addressServiceData = addressService;
import { LENS_HUB_CONTRACT_ADDRESS, signCreatePostTypedData } from '../api_cql'
import LENSHUB from '../abi/lenshub'
import { create } from 'ipfs-http-client'
import { v4 as uuid } from 'uuid'
import { refreshAuthToken, splitSignature } from '../utils'
import { client, GetDefaultProfile} from "../api";
import Router from "next/router";
import { BehaviorSubject } from "rxjs";
const profileSubject = new BehaviorSubject(
  process.browser && JSON.parse(localStorage.getItem("profile"))
);

const projectId = process.env.NEXT_PUBLIC_PROJECT_ID
const projectSecret = process.env.NEXT_PUBLIC_PROJECT_SECRET
const auth = 'Basic ' + Buffer.from(projectId + ':' + projectSecret).toString('base64');

const clientQuery = create({
  host: 'ipfs.infura.io',
  port: 5001,
  protocol: 'https',
  headers: {
      authorization: auth,
  },
})

export default function CreatePost() {
  const { address } = useAccount();
  const { data: ensName } = useEnsName({ address });
  const [userAddress, setUserAddress] = useState("");
  const [profile, setUserProfile] = useState();
  const [contentMessage, setContentMessage] = useState("");
  const [isPostCreated, setIsPostCreated] = useState(false);
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
  }, [userAddress]);     // eslint-disable-next-line react-hooks/exhaustive-deps


  useEffect(() => {
    if(isPostCreated){
      Router.push("/my-activities");
    }

      // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isPostCreated]); // eslint-disable-next-line react-hooks/exhaustive-deps


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

  async function uploadToIPFS() {
    const metaData = {
      version: '2.0.0',
      content: contentMessage,
      description: contentMessage,
      name: `Post by @${profile.handle}`,
      external_url: `https://lenster.xyz/u/${profile.handle}`,
      metadata_id: uuid(),
      mainContentFocus: 'TEXT_ONLY',
      attributes: [],
      locale: 'en-US',
    }

    const added = await clientQuery.add(JSON.stringify(metaData))
    const uri = `https://ipfs.infura.io/ipfs/${added.path}`
    return uri
  }

  async function savePost(e) {
    e.preventDefault();
    if (!profile) return
    if (!signer) {
        console.log("signer is missing")
        return;
    }
    const contentURI = await uploadToIPFS()
    const { accessToken } = await refreshAuthToken()
    const createPostRequest = {
      profileId: profile.id,
      contentURI,
      collectModule: {
        freeCollectModule: { followerOnly: true }
      },
      referenceModule: {
        followerOnlyReferenceModule: false
      },
    }

    try {
      const signedResult = await signCreatePostTypedData(createPostRequest, accessToken)
      const typedData = signedResult.result.typedData
      const { v, r, s } = splitSignature(signedResult.signature)

      const contract = new ethers.Contract(
        LENS_HUB_CONTRACT_ADDRESS,
        LENSHUB,
        signer
      )

      const tx = await contract.postWithSig({
        profileId: typedData.value.profileId,
        contentURI: typedData.value.contentURI,
        collectModule: typedData.value.collectModule,
        collectModuleInitData: typedData.value.collectModuleInitData,
        referenceModule: typedData.value.referenceModule,
        referenceModuleInitData: typedData.value.referenceModuleInitData,
        sig: {
          v,
          r,
          s,
          deadline: typedData.value.deadline,
        },
      })

      await tx.wait()
      console.log('successfully created post: tx hash', tx.hash)
      alert("hopefully your post has been created 🙈")
      setIsPostCreated(true)

      
    } catch (err) {
      console.log('error: ', err)
    }
  }

  if (!profile) {
    return null
  }
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
        <div>
          <div className="postpage">
            <Head>
              <title> Post Page</title>
              <meta name="description" content="Lit-Dapp" />
              <link rel="icon" href="/favicon.ico" />
            </Head>

            <main>
              <div className="container">
                <div className="headerlogo">
                  <img
                    src="images/Logo.png"
                    alt="logo"
                    className="postpagelogo"
                  />
                </div>
                <hr></hr>
                <div className="wrapper">
                  <div className="post">
                    <form action="#">
                      <div className="content">
                        <img src="images/profile-picture.png" alt="" />
                        <p>{profile.handle}</p>
                      </div>
                      <textarea
                        placeholder="What's on your mind?"
                        spellCheck="false"
                        cols="20"
                        rows="7"
                        required
                        onChange={(e) => setContentMessage(e.target.value)}
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

                      <button onClick={savePost}>Post</button>
                    </form>
                  </div>
                </div>
              </div>
            </main>
          </div>
        </div>
      </main>
    </div>
  );
}
