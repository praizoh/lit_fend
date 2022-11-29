import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useAccount, useDisconnect, useEnsAvatar,
  useEnsName, } from "wagmi";
import Head from "next/head";
import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Router from 'next/router'

export default function Home() {
  const { data: account } = useAccount();
  const [ address, setAddress ] = useState("");
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
        setAddress(account.address) // account.address="89494", address=89494
      }
    }
  },[account])

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
      Router.push('/dashboard')
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
