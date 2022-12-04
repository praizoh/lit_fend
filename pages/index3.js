import { ConnectButton } from "@rainbow-me/rainbowkit";
import Head from "next/head";
import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  useAccount,
  useSigner,
  useDisconnect,
  useEnsAvatar,
  useEnsName,
  useSignMessage,
  useProvider
} from "wagmi";
import { client, getChallenge, Authentication } from "../api";
import Router from "next/router";
import { BehaviorSubject } from "rxjs";
const userSubject = new BehaviorSubject(
  process.browser && JSON.parse(localStorage.getItem("user"))
);



export default function Home() {
  const provider = useProvider()
  console.log(provider)
  const { data: account } = useAccount();
  const [ address, setAddress ] = useState("");
  const { data: signer } = useSigner({
    onError(error) {
      console.log("Error", error);
    },
  });
  const [isLogin, setIsLogin] = useState(false)
  // const { data: ensAvatar } = useEnsAvatar({ address })
  // const { data: ensName } = useEnsName({ address })
  // const { disconnect } = useDisconnect();
  const [ens, setENS] = useState(""); 

  // const setENSOrAddress = async () => {
  //   console.log(ensName)

  // };

  useEffect(()=>{
    if(account){
      if(account.address){
        setAddress(account.address)
        login();
      }
    }
    if (!signer) {
      return;
    }
  },[account, signer, isLogin])


  async function login() {
    try {
      const response = await challengeGetter();
      const text = response.data.challenge.text;
      const signedMsg = await signText(text);
      console.log(signedMsg);
      console.log(client);
      const auth = await client
        .mutation(Authentication, {
          address: account.address,
          signature: signedMsg,
        })
        .toPromise();
      if(auth.data.authenticate){
        setIsLogin(true)
      }
      console.log(auth.data.authenticate);
      userSubject.next(auth.data.authenticate);
      localStorage.setItem("user", JSON.stringify(auth.data.authenticate));
      return response;
    } catch (err) {
      console.log(err);
    }
  }

  async function challengeGetter() {
    try {
      console.log("calling challenge");
      console.log(account.address);
      const response = await client
        .query(getChallenge, { address: account.address })
        .toPromise();
      return response;
    } catch (err) {
      console.log(err);
    }
  }

  async function signText(text) {
    try {
      return await signer.signMessage(text);
    } catch (err) {
      console.log(err);
    }
  }


  /*
      renderButton: Returns a button based on the state of the dapp
    */
  const renderButton = () => {
    // If wallet is not connected, return a button which allows them to connect their wllet
    if (!address) {
      return (
        <div>
          <div className="connect-msg">
            <p className="welcome"> Welcome Back To Lit</p>
            <p className="connect-acct">
              Connect your account to get started with Lit
            </p>
          </div>
          <div className="connect-wallet">
            <img src="./images/wallet.png" alt="" />
            <div><ConnectButton
              label="Connect to wallet"
              style="background-color: transparent; color: black;"
            /></div>
          </div>
        </div>
      );
    } else {
      if(isLogin){
        Router.push('/create-profile')
      }else{
        login()
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
