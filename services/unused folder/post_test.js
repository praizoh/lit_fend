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
import { CreateProfileLens } from "../../api";
import { userService, profileService } from "../userService";
import Router from "next/router";
import { BehaviorSubject } from "rxjs";
const profileSubject = new BehaviorSubject(
  process.browser && JSON.parse(localStorage.getItem("profile"))
);
import { client, GetDefaultProfile, HasTxHashBeenIndexed } from "../../api";
import { BigNumber, utils } from "ethers";
import { createPost } from "../create_post";

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
  const profileInfoId = profileServiceData.profileValue.id;

  useEffect(async () => {
    if (!account) {
      Router.push("/");
    }
    if (!signer) {
      return;
    }
    await getDefaultProfile();
    if (!getDefaultProfileData.profileValue.id) {
      console.log("user does not have profile");
      Router.push("/");
    } else {
      console.log("profile created");
    }
  }, [account, signer]);
  createPost(profileInfoId);

  return (
    <div>
      <h1></h1>
    </div>
  );
}
