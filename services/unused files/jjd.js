import { useState, useEffect } from 'react'
import { ethers } from 'ethers'
import { css } from '@emotion/css'
import { PINK } from '../../theme'
import { Button } from '../../components'
import { v4 as uuid } from 'uuid'
import { create } from 'ipfs-http-client'
import PERIPHERY from '../../abi/lensperiphery.json'
import {
  createProfileMetadataTypedData,
  createClient,
  PERIPHERY_CONTRACT_ADDRESS
} from '../../api_cql'
import Router from "next/router";
import { signedTypeData, splitSignature } from '../../utils'
import { client, GetDefaultProfile} from "../../api";
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
  } from "../userService";
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
  }, [userAddress]);

  useEffect(() => {
    if(isProfileUpdateDone){
      Router.push("/my-profile");
    }
  }, [isProfileUpdateDone]);

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

    const added = await clientQuery.add(JSON.stringify(newMeta))

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
    alert("your profile has been updated 🙈")
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
  )
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