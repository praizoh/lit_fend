import Head from "next/head";
import { useState, useEffect, useContext } from "react";
import { AppContext } from '../context'
import { CreateProfileLens } from "../api";
import { client, GetDefaultProfile, HasTxHashBeenIndexed } from "../api";
import { addressService,userService, profileService } from "../services/userService";
import Router from "next/router";
import { BehaviorSubject } from "rxjs";
const profileSubject = new BehaviorSubject(
  process.browser && JSON.parse(localStorage.getItem("profile"))
  );
export default function Createprofile() {
  const [username, setUsername]= useState("")
  const context = useContext(AppContext)
  console.log(context)
  const [userProfile, setUserProfile] = useState()

  const userServiceData = userService;
  const profileServiceData = profileService;
  const addressServiceData = addressService
  const userAddress = addressServiceData.addressValue
  useEffect(() => {
    if (!userAddress) {
      Router.push("/");
    }
    getDefaultProfile();
  }, [userProfile]);

  async function createProfile() {
    try {
      console.log(userServiceData.userValue);
      const profile = await client
        .mutation(CreateProfileLens, {
          handle: username,
        })
        .toPromise();
      console.log(profile);
      if (profile.data.createProfile.__typename === "RelayError") {
        console.error(
          "create profile: failed " + profile.data.createProfile.reason
        );
        return;
      }
      console.log("create profile: poll until indexed");
      const result = await pollUntilIndexed(profile.data.createProfile.txHash);

      console.log("create profile: profile has been indexed", result);

      const logs = result.txReceipt.logs;

      console.log("create profile: logs", logs);

      const topicId = utils.id(
        "ProfileCreated(uint256,address,address,string,string,address,bytes,string,uint256)"
      );
      console.log("topicid we care about", topicId);

      const profileCreatedLog = logs.find((l) => l.topics[0] === topicId);
      console.log("profile created log", profileCreatedLog);

      let profileCreatedEventLog = profileCreatedLog.topics;
      console.log("profile created event logs", profileCreatedEventLog);

      const profileId = utils.defaultAbiCoder.decode(
        ["uint256"],
        profileCreatedEventLog[1]
      )[0];

      console.log("profile id", BigNumber.from(profileId).toHexString());

      return profile;
    } catch (err) {
      console.log(err);
    }
  }

  const hasTxBeenIndexed = async (request) => {
    const result = await client
      .query(
        HasTxHashBeenIndexed,
        { txHash: request },
        { fetchPolicy: "network-only" }
      )
      .toPromise();

    return result.data.hasTxHashBeenIndexed;
  };

  async function pollUntilIndexed(input) {
    while (true) {
      const response = await hasTxBeenIndexed(input);
      console.log("pool until indexed: result", response);

      if (response.__typename === "TransactionIndexedResult") {
        console.log("pool until indexed: indexed", response.indexed);
        console.log(
          "pool until metadataStatus: metadataStatus",
          response.metadataStatus
        );

        console.log(response.metadataStatus);
        if (response.metadataStatus) {
          if (response.metadataStatus.status === "SUCCESS") {
            return response;
          }

          if (response.metadataStatus.status === "METADATA_VALIDATION_FAILED") {
            throw new Error(response.metadataStatus.status);
          }
        } else {
          if (response.indexed) {
            return response;
          }
        }

        console.log(
          "pool until indexed: sleep for 1500 milliseconds then try again"
        );
        // sleep for a second before trying again
        await new Promise((resolve) => setTimeout(resolve, 1500));
      } else {
        // it got reverted and failed!
        throw new Error(response.reason);
      }
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
      setUserProfile(response.data.defaultProfile)
      profileSubject.next(response.data.defaultProfile);
        localStorage.setItem("profile", JSON.stringify(response.data.defaultProfile));
    } catch (err) {
      console.log(err);
    }
  }


  return (
    <div className="createprofile">
      <Head>
        <title>Lit Profile</title>
        <meta name="description" content="Lit-Dapp" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <div className="cprofile">
          <img
            src="images/Logo.png"
            alt="logo"
            width="32px"
            height="32px"
            className="clogo"
          />
          <h3>Welcome To Lit</h3>
          <p>Create your account to get started with Lit</p>
          <input
            type="file"
            id="cimage"
            accept="image/*"
            placeholder="add profile picture"
            className="imagep"
          ></input>
          <input type="text" placeholder="User name" onChange={e => setUsername(e.target.value)} required minLength={5} maxLength={30}></input>
          <button onClick={createProfile}>Create Profile</button>
          <p className="cuser">
            Already have an account? <a href="index.js">Log in</a>
          </p>
        </div>
      </main>
    </div>
  );
}
