import Head from "next/head";
import { useState, useEffect } from "react";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import {
  useAccount,
  useSigner,
  useDisconnect,
  useEnsAvatar,
  useEnsName,
  useSignMessage,
} from "wagmi";
import { CreateProfileLens } from "../api";
import { userService, profileService } from "./userService";
import Router from "next/router";
import { BehaviorSubject } from "rxjs";
const profileSubject = new BehaviorSubject(
  process.browser && JSON.parse(localStorage.getItem("profile"))
);
import { client, GetDefaultProfile, HasTxHashBeenIndexed } from "../api";
import { BigNumber, utils } from "ethers";

export default function Home() {
  const [token, setToken] = useState("");
  const { data: account } = useAccount();
  const { data: signer } = useSigner({
    onError(error) {
      console.log("Error", error);
    },
  });
  const userServiceData = userService;
  const profileServiceData = profileService;
  

  useEffect(async() => {
    if (!account) {
      Router.push("/");
    }
    if (!signer) {
      return;
    }
    await getDefaultProfile();
    if(!getDefaultProfileData.profileValue.id){
        await createProfile();
    }else{
        console.log("profile created")
    }
  }, [account, signer]);

  async function createProfile() {
    try {
      console.log(userServiceData.userValue);
      const profile = await client
        .mutation(CreateProfileLens, {
          handle: "jamzzey",
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
      console.log(account.address);
      const response = await client
        .query(GetDefaultProfile, { address: account.address })
        .toPromise();
      console.log(response);
      profileSubject.next(response.data.defaultProfile);
      localStorage.setItem("profile", JSON.stringify(response.data.defaultProfile));
      return response.data.defaultProfile;
    } catch (err) {
      console.log(err);
    }
  }

  return (
    <div>
      <h1></h1>
    </div>
  );
}
