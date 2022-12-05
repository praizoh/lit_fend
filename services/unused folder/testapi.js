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
import { client, getChallenge, Authentication } from "../../api";
import Router from "next/router";
import { BehaviorSubject } from "rxjs";
const userSubject = new BehaviorSubject(
  process.browser && JSON.parse(localStorage.getItem("user"))
);


export default function Home() {
  const [token, setToken] = useState("");
  const { data: account } = useAccount();
  const { data: signer } = useSigner({
    onError(error) {
      console.log("Error", error);
    },
  });

  useEffect(() => {
    if (!account) {
      Router.push("/");
    }
    if (!signer) {
      return;
    }
    login();
  }, [account, signer]);

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
      console.log(auth.data.authenticate);
      userSubject.next(auth.data.authenticate);
      localStorage.setItem("user", JSON.stringify(auth.data.authenticate));
      return response;
    } catch (err) {
      console.log(err);
    }
  }

  function logout() {
    // remove user from local storage, publish null to user subscribers and redirect to login page
    localStorage.removeItem("user");
    userSubject.next(null);
    Router.push("/");
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
  return (
    <div>
      <h1></h1>
    </div>
  );
}
