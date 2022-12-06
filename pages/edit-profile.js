import Head from "next/head";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import Link from 'next/link'
import { useState, useEffect } from 'react'
import { ethers } from 'ethers'
import { css } from '@emotion/css'
import { PINK } from '../theme'
import { Button } from '../components'
import { v4 as uuid } from 'uuid'
import { create } from 'ipfs-http-client'
import PERIPHERY from '../abi/lensperiphery.json'
import {
  createProfileMetadataTypedData,
  createClient,
  PERIPHERY_CONTRACT_ADDRESS
} from '../api_cql'
import Router from "next/router";
import { signedTypeData, splitSignature } from '../utils'
import { client, GetDefaultProfile} from "../api";
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

export default function EditProfile() {
  const { address } = useAccount();
  const { data: signer } = useSigner({
    onError(error) {
      console.log("Error", error);
    },
  });
  const { data: ensName } = useEnsName({ address });
  // Captures 0x + 4 characters, then the last 4 characters.
  const truncateRegex = /^(0x[a-zA-Z0-9]{4})[a-zA-Z0-9]+([a-zA-Z0-9]{4})$/;

  const truncateEthAddress = (address) => {
    const match = address.match(truncateRegex);
    if (!match) return address;
    return `${match[1]}…${match[2]}`;
  };

  

  const [updatedProfile, setUpdatedProfile] = useState()
  const [userAddress, setUserAddress] = useState("");
  const [profile, setUserProfile] = useState();
  const [isProfileUpdateDone, setIsProfileUpdateDone] = useState(false);


  useEffect(() => {
    console.log(address)
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


  useEffect(() => {
    if(isProfileUpdateDone){
      Router.push("/my-profile");
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isProfileUpdateDone]);     // eslint-disable-next-line react-hooks/exhaustive-deps


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

  async function updateProfile() {
    if (!updatedProfile) return
    if (!signer) {
        console.log("signer is missing")
        return;
    }
    if (updatedProfile.twitter) {
      const index = profile.attributes.findIndex(v => v.key === 'twitter')
      profile.attributes[index].value = updatedProfile.twitter
    }

    const newMeta = {
      name: profile.name,
      bio: profile.bio,
      attributes: profile.attributes,
      version: "1.0.0",
      metadata_id: uuid(),
      previousMetadata: profile.metadata,
      createdOn: new Date().toISOString(),
      appId: "LitLenApp",
      ...updatedProfile,
    }

    if (profile.coverPicture) {
      newMeta.cover_picture = profile.coverPicture.original.url
    } else {
      newMeta.cover_picture = null
    }
    console.log(newMeta)
    const added = await clientQuery.add(JSON.stringify(newMeta))
    console.log(added)
    const newMetadataURI = `https://ipfs.infura.io/ipfs/${added.path}`

    // using the GraphQL API may be unnecessary
    // if you are not using gasless transactions
    const urqlClient = await createClient()
    const data = await urqlClient.mutation(createProfileMetadataTypedData, {
      profileId: profile.id, metadata: newMetadataURI
    }).toPromise()
    console.log(data)
    const typedData = data.data.createSetProfileMetadataTypedData.typedData;
    
    const signature = await signedTypeData(typedData.domain, typedData.types, typedData.value)
    const { v, r, s } = splitSignature(signature);

    const contract = new ethers.Contract(
      PERIPHERY_CONTRACT_ADDRESS,
      PERIPHERY,
      signer
    )
    console.log(profile.id)
    const tx = await contract.setProfileMetadataURIWithSig({
      profileId: profile.id,
      metadata: newMetadataURI,
      sig: {
        v,
        r,
        s,
        deadline: typedData.value.deadline,
      },
    });
    console.log('tx: ', tx)
    alert("hopefully your profile has been updated 🙈")
    setIsProfileUpdateDone(true)
  }
 
  if (!profile) {
    return null
  }

  const meta = profile.attributes.reduce((acc, next) => {
    acc[next.key] = next.value
    return acc
  }, {})

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
              <Image
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
            <Image src="images/Logo.png" alt="logo" width="32px" height="32px" />
            </div>
        </div>
        <div></div>
        <div className="dasboard">
            {/* task bar */}
            <div className="taskbars">
            {/* post icon */}

            {/* <Image
                src="images/create-post.png"
                alt="create post"
                className="createpost"
            /> */}
            <div className="taskbar">
            <Link href={'/dashboard'}>
              <div className="hand">
                <Image src="images/home.png" alt="home icon" />
                <p>Home</p>
              </div>
            </Link>
            <Link href={"/explore-profiles"}>
              <div className="hand">
                <Image src="images/communities.png" alt="communities icon" />
                <p>Profiles</p>
              </div>
            </Link>
            <Link href={"/my-activities"}>
              <div className="hand">
                <Image src="images/activities.png" alt="activities icon" />
                <p>My Activities</p>
              </div>
            </Link>
            <Link href={"/create-post"}>
              <div className="hand">
              <Image
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
        <div className={containerStyle}>
      <h2>Edit Profile</h2>
      <div className={formContainer}>
        <label className={labelStyle}>Name</label>
        <input
          value={updatedProfile && updatedProfile.name ? updatedProfile.name : profile.name}
          className={inputStyle}
          onChange={e => setUpdatedProfile({ ...updatedProfile, name: e.target.value })}
        />
        <label className={labelStyle}>Bio</label>
        <textarea
          value={updatedProfile && updatedProfile.bio ? updatedProfile.bio : profile.bio}
          className={textAreaStyle}
          onChange={e => setUpdatedProfile({ ...updatedProfile, bio: e.target.value })}
        />
        {
          meta && meta.twitter && (
            <>
              <label className={labelStyle}>Twitter</label>
              <input
                value={updatedProfile && updatedProfile.twitter ? updatedProfile.twitter : meta.twitter}
                className={inputStyle}
                onChange={e => setUpdatedProfile({ ...updatedProfile, twitter: e.target.value })}
              />
            </>
          )
        }
        <Button
          buttonText="Save Profile"
          onClick={updateProfile}
        />
      </div>
    </div>
      </main>
    </div>
  );
}

const containerStyle = css`
  padding-top: 25px;
`

const inputStyle = css`
  width: 100%;
  border-radius: 12px;
  outline: none;
  border: 2px solid rgba(0, 0, 0, .05);
  padding: 12px 18px;
  font-size: 14px;
  border-color: transpaent;
  margin-top: 10px;
  margin-bottom: 30px;
  &:focus {
    border-color: rgb(${PINK});
  }
`

const textAreaStyle = css`
  ${inputStyle};
  height: 100px;
`

const labelStyle = css`
  font-weight: 600;
`

const formContainer = css`
  margin-top: 40px;
`
