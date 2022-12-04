import { useState, useEffect } from 'react'
import { ethers, providers } from 'ethers'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { createClient, STORAGE_KEY, authenticate as authenticateMutation, getChallenge, getDefaultProfile } from '../api_cql'
import { parseJwt, refreshAuthToken } from '../utils'
import { AppContext } from '../context'
import Head from "next/head";

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
  const [connected, setConnected] = useState(true)
  const [userAddress, setUserAddress] = useState()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [userProfile, setUserProfile] = useState()
  const router = useRouter()

  useEffect(() => {
    refreshAuthToken()
    async function checkConnection() {
      const provider = new ethers.providers.Web3Provider(
        (window).ethereum
      )
      const addresses = await provider.listAccounts();
      if (addresses.length) {
        setConnected(true)
        setUserAddress(addresses[0])
        addressSubject.next(addresses[0]);
        localStorage.setItem("address", JSON.stringify(addresses[0]));
        getUserProfile(addresses[0])
      } else {
        setConnected(false)
      }
    }
    checkConnection()
    listenForRouteChangeEvents()
  }, [])

  async function getUserProfile(address) {
    try {
      const urqlClient = await createClient()
      const response = await urqlClient.query(getDefaultProfile, {
        address
      }).toPromise()
      console.log(response)
      if(response.data.defaultProfile == null) {
        router.push('/create-profile')
      }else{
        router.push('/dashboard')
        setUserProfile(response.data.defaultProfile)
        profileSubject.next(response.data.defaultProfile);
        localStorage.setItem("profile", JSON.stringify(response.data.defaultProfile));
      }
      
    } catch (err) {
      console.log('error fetching user profile...: ', err)
    }
  }

  async function listenForRouteChangeEvents() {
    router.events.on('routeChangeStart', () => {
      refreshAuthToken()
    })
  }

  async function signIn() {
    try {
      const accounts = await window.ethereum.send(
        "eth_requestAccounts"
      )
      setConnected(true)
      const account = accounts.result[0]
      console.log(account)
      setUserAddress(account)
      addressSubject.next(account);
        localStorage.setItem("address", JSON.stringify(account));
      const urqlClient = await createClient()
      const response = await urqlClient.query(getChallenge, {
        address: account
      }).toPromise()
      const provider = new providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner()
      const signature = await signer.signMessage(response.data.challenge.text)
      const authData = await urqlClient.mutation(authenticateMutation, {
        address: account, signature
      }).toPromise()
      const { accessToken, refreshToken } = authData.data.authenticate
      const accessTokenData = parseJwt(accessToken)
      userSubject.next(authData.data.authenticate);
      localStorage.setItem("user", JSON.stringify(authData.data.authenticate));
      getUserProfile(account)
      localStorage.setItem(STORAGE_KEY, JSON.stringify({
        accessToken, refreshToken, exp: accessTokenData.exp
      }))
    } catch (err) {
      console.log('error: ', err)
    }
  }

  /*
      renderButton: Returns a button based on the state of the dapp
    */
      const renderButton = () => {
        // If wallet is not connected, return a button which allows them to connect their wllet
        if (!userAddress) {
          return (
            <div>
              <div className="connect-msg">
                <p className="welcome"> Welcome Back To Lit</p>
                <p className="connect-acct">
                  Connect your account to get started with Lit
                </p>
              </div>
              <div className="connect-wallet" onClick={signIn}>
                <img src="./images/wallet.png" alt=""/>
                <span>connect to wallet</span>
            </div>
            </div>
          )
        }
      };

  return (
    <AppContext.Provider value={{
      userAddress,
      profile: userProfile
    }}>
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
    </AppContext.Provider>
  );
}