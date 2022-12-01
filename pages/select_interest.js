import Head from "next/head";
import { useState, useEffect } from "react";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import {
  useAccount,
  useDisconnect,
  useEnsAvatar,
  useEnsName,
  useSigner,
} from "wagmi";
import { client, explorePublications } from "../api";
import Router from "next/router";

export default function SelectInterest() {
  const { data: account } = useAccount();
  const [active, setActive] = useState([])


  useEffect(() => {
    if (!account) {
      Router.push("/");
    }
  }, [account]);
  const interestItems = [
    { id: 1, name: "Anime", isActive:false },
    { id: 2, name: "Art & Craft" },
    { id: 3, name: "Automative" },
    { id: 4, name: "Blockchain" },
    { id: 5, name: "Business $ Finance" },
    { id: 6, name: "Cybersecurity" },
    { id: 7, name: "Design" },
    { id: 8, name: "Education" },
    { id: 9, name: "Food & Relationship" },
    { id: 10, name: "Fashion & Beauty" },
    { id: 11, name: "Food" },
    { id: 12, name: "Games" },
    { id: 13, name: "Health & Fitness" },
    { id: 14, name: "Movies" },
    { id: 15, name: "NFTs" },
    { id: 16, name: "Open Source" },
    { id: 17, name: "Outdoor" },
    { id: 18, name: "Photography" },
    { id: 19, name: "Politics" },
    { id: 20, name: "Religion" },
    { id: 21, name: "Science" },
    { id: 22, name: "Sports" },
    { id: 23, name: "Technology" },
    { id: 24, name: "Travel" },
    { id: 25, name: "Web3" },
    { id: 26, name: "Web3 Ladies" },
    { id: 27, name: "Web development" },
    { id: 28, name: "Women In Tech" },
    { id: 29, name: "Writing" },
  ];
  function routeDashboard(e) {
    e.preventDefault();
    Router.push("/dashboard");
  }
  return (
    <div className="interestPage">
      <Head>
        <title>Lit select interest</title>
        <meta name="description" content="Lit-Dapp" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <div>
          <a href="#" className="skip">
            skip
          </a>
        </div>
        <div className="interest">
          <h1>Choose Your Interest</h1>
          <p className="app-experience">
            Choose which you have more interest to give you the best app
            experience
          </p>
          {/* <div className="interest-opt">
            <p id="interest-btn1">Anime</p>
            <p id="interest-btn2">Art$ Craft</p>
            <p id="interest-btn3">Automative</p>
            <p id="interest-btn4">Blockchain</p>
            <p id="interest-btn5">Business $ Finance</p>
            <p id="interest-btn6">Cybersecurity</p>
            <p id="interest-btn7">Design</p>
            <p id="interest-btn8">Education</p>
            <p id="interest-btn9">Food $ Relationship</p>
            <p id="interest-btn10">Fashion $ Beauty</p>
            <p id="interest-btn11">Food</p>
            <p id="interest-btn12">Games</p>
            <p id="interest-btn13">Health $ Fitness</p>
            <p id="interest-btn14">Movies</p>
            <p id="interest-btn15">NFTs</p>
            <p id="interest-btn16">Open Source</p>
            <p id="interest-btn17">Outdoor</p>
            <p id="interest-btn18">Photography</p>
            <p id="interest-btn19">Politics</p>
            <p id="interest-btn20">Religion</p>
            <p id="interest-btn21">Religion</p>
            <p id="interest-btn22">Science</p>
            <p id="interest-btn23">Science</p>
            <p id="interest-btn24">Sports</p>
            <p id="interest-btn25">Technology</p>
            <p id="interest-btn26">Travel</p>
            <p id="interest-btn27">Web3</p>
            <p id="interest-btn28">Web3 Ladies</p>
            <p id="interest-btn29">Web development</p>
            <p id="interest-btn30">women In Tech</p>
            <p id="interest-btn31">Writing</p>
          </div> */}
          <div className="interest-opt">
            {interestItems.map((item, id) => {
                const isActive = active.includes(item.id)

              return (
                <p
                  key={item.id}
                  onClick={() => setActive(isActive
                    ? active.filter(current => current !== item.id)
                    : [...active, item.id]
                  )}
                  style={{
                    backgroundColor: isActive ? "#502F8A" : "",
                    color: isActive ? "#fff" : "",
                  }}
                >
                  {item.name}
                </p>
              );
            })}
          </div>
        </div>

        <button className="btn-continue" onClick={routeDashboard}>
          continue
        </button>
      </main>
    </div>
  );
}
