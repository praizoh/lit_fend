/* eslint-disable @next/next/no-img-element */

import { ConnectButton } from "@rainbow-me/rainbowkit";
import Head from "next/head";
import {
  useAccount,
  useDisconnect,
  useEnsAvatar,
  useEnsName,
  useSigner,
} from "wagmi";
import React, { useEffect, useRef, useState } from "react";
import {
  client,
  getChallenge,
  Authentication,
  GetDefaultProfile,
} from "../api";
import { parseJwt, refreshAuthToken } from "../utils";
import { STORAGE_KEY } from "../api_cql";
import Router from "next/router";
import { BehaviorSubject } from "rxjs";
const profileSubject = new BehaviorSubject(
  process.browser && JSON.parse(localStorage.getItem("profile"))
);
const addressSubject = new BehaviorSubject(
  process.browser && JSON.parse(localStorage.getItem("address"))
);
const userSubject = new BehaviorSubject(
  process.browser && JSON.parse(localStorage.getItem("user"))
);

export default function Home() {
  const { address } = useAccount();
  const { data: signer } = useSigner({
    onError(error) {
      console.log("Error", error);
    },
  });
  const { data: ensName } = useEnsName({ address });

  const [isLogin, setIsLogin] = useState(false);
  const [challenge, setChallenge] = useState("");
  const [signedMsg, setSignedMsg] = useState("");
  const [userAddress, setUserAddress] = useState("");
  const [userProfile, setUserProfile] = useState();

  console.log(address);

  useEffect(() => {
    setUserAddress(address);
    addressSubject.next(address);
    localStorage.setItem("address", JSON.stringify(address));
    if (userAddress) {
      challengeGetter();
      if (!signer) {
        return;
      }
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [address, signer]); // eslint-disable-next-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (challenge && signer) {
      signText();
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [challenge, signer]); // eslint-disable-next-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (challenge && signedMsg) {
      login();
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [challenge, signedMsg]); // eslint-disable-next-line react-hooks/exhaustive-deps

  async function login() {
    try {
      const auth = await client
        .mutation(Authentication, {
          address: userAddress,
          signature: signedMsg,
        })
        .toPromise();
      if (auth.data.authenticate) {
        setIsLogin(true);
      }
      console.log(auth.data.authenticate);
      const { accessToken, refreshToken } = auth.data.authenticate;
      const accessTokenData = parseJwt(accessToken);
      userSubject.next(auth.data.authenticate);
      localStorage.setItem("user", JSON.stringify(auth.data.authenticate));
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({
          accessToken,
          refreshToken,
          exp: accessTokenData.exp,
        })
      );
      return response;
    } catch (err) {
      console.log(err);
    }
  }

  async function challengeGetter() {
    try {
      console.log("calling challenge");
      console.log(userAddress);
      const response = await client
        .query(getChallenge, { address: userAddress })
        .toPromise();
      console.log(response);
      setChallenge(response.data.challenge.text);
      return response;
    } catch (err) {
      console.log(err);
    }
  }

  async function signText(text = challenge) {
    try {
      const sigMsg = await signer.signMessage(text);
      setSignedMsg(sigMsg);
      console.log(sigMsg);
      return sigMsg;
    } catch (err) {
      console.log(err);
    }
  }

  async function getUserProfile(userAddress) {
    try {
      const response = await client
        .query(GetDefaultProfile, {
          address: userAddress,
        })
        .toPromise();
      console.log(response);
      if (response.data.defaultProfile == null) {
        Router.push("/create-profile");
      } else {
        Router.push("/dashboard");
        setUserProfile(response.data.defaultProfile);
        profileSubject.next(response.data.defaultProfile);
        localStorage.setItem(
          "profile",
          JSON.stringify(response.data.defaultProfile)
        );
      }
    } catch (err) {
      console.log("error fetching user profile...: ", err);
    }
  }

  const renderButton = () => {
    // If wallet is not connected, return a button which allows them to connect their wllet
    if (!userAddress) {
      return (
        <div>
          <div className="connect-msg">
            <p className="welcome"> Welcome To Lit</p>
            <p className="connect-acct">
              Connect your account to get started with Lit
            </p>
          </div>
          <div className="connect-wallet">
            <img src="./images/wallet.png" alt="" />
            <div>
              <ConnectButton
                label="Connect to wallet"
                style="background-color: transparent; color: black;"
              />
            </div>
          </div>
        </div>
      );
    } else {
      if (isLogin) {
        getUserProfile(address);
        return (
          <div>
            <div className="connect-msg">
              <p className="welcome"> Welcome Back To Lit</p>
              <p className="connect-acct">
                You are logged in and will be routed in to the app...
              </p>
            </div>
            <div className="connect-wallet">
              <img src="./images/wallet.png" alt="" />
              <div>
                <ConnectButton
                  label="Connect to wallet"
                  style="background-color: transparent; color: black;"
                />
              </div>
            </div>
          </div>
        );
      } else {
        return (
          <div>
            <div className="connect-msg">
              <p className="welcome"> Welcome Back To Lit</p>
              <p className="connect-acct">
                You will be signed in to the application in a few minutes
              </p>
            </div>
            <div className="connect-wallet">
              <img src="./images/wallet.png" alt="" />
              <div>
                <ConnectButton
                  label="Connect to wallet"
                  style="background-color: transparent; color: black;"
                />
              </div>
            </div>
          </div>
        );
      }
    }
  };

  return (
    <div className="login">
      <Head>
        <title>Lit</title>
        <meta name="description" content="Lit-Dapp" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <div className="logo">
          <img src="./images/Logo.png" alt="" />
        </div>
        {renderButton()}
      </main>
    </div>
  );
}
