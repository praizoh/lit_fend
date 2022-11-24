import { Contract, providers, utils } from "ethers";
import Head from "next/head";
import React, { useEffect, useRef, useState } from "react";
import Web3Modal from "web3modal";

export default function Home() {
  // walletConnected keep track of whether the user's wallet is connected or not
  const [walletConnected, setWalletConnected] = useState(false);
  // ENS
  const [ens, setENS] = useState("");
  // Create a reference to the Web3 Modal (used for connecting to Metamask) which persists as long as the page is open
  const web3ModalRef = useRef();
  // Save the address of the currently connected account
  const [address, setAddress] = useState("");

  /**
   * Sets the ENS, if the current connected address has an associated ENS or else it sets
   * the address of the connected account
   */
  const setENSOrAddress = async (address, web3Provider) => {
    // Lookup the ENS related to the given address
    var _ens = await web3Provider.lookupAddress(address);
    // If the address has an ENS set the ENS or else just set the address
    if (_ens) {
      setENS(_ens);
    } else {
      setAddress(address);
    }
  };

  /*
      connectWallet: Connects the MetaMask wallet
    */
  const connectWallet = async () => {
    try {
      // Get the provider from web3Modal, which in our case is MetaMask
      // When used for the first time, it prompts the user to connect their wallet
      await getProviderOrSigner(true);
      setWalletConnected(true);
    } catch (err) {
      console.error(err);
    }
  };

  /**
   * Returns a Provider or Signer object representing the Ethereum RPC with or without the
   * signing capabilities of metamask attached
   *
   * A `Provider` is needed to interact with the blockchain - reading transactions, reading balances, reading state, etc.
   *
   * A `Signer` is a special type of Provider used in case a `write` transaction needs to be made to the blockchain, which involves the connected account
   * needing to make a digital signature to authorize the transaction being sent. Metamask exposes a Signer API to allow your website to
   * request signatures from the user using Signer functions.
   *
   * @param {*} needSigner - True if you need the signer, default false otherwise
   */
  const getProviderOrSigner = async (needSigner = false) => {
    // Connect to Metamask
    // Since we store `web3Modal` as a reference, we need to access the `current` value to get access to the underlying object
    const provider = await web3ModalRef.current.connect();
    const web3Provider = new providers.Web3Provider(provider);

    // If user is not connected to the Goerli network, let them know and throw an error
    const { chainId } = await web3Provider.getNetwork();
    if (chainId !== 5) {
      window.alert("Change the network to Goerli");
      throw new Error("Change network to Goerli");
    }

    if (needSigner) {
      const signer = web3Provider.getSigner();
      // Get the address associated to the signer which is connected to  MetaMask
      const address = await signer.getAddress();
      // Calls the function to set the ENS or Address
      await setENSOrAddress(address, web3Provider);
      return signer;
    }
    return web3Provider;
  };

  /*
      renderButton: Returns a button based on the state of the dapp
    */
  const renderButton = () => {
    // If wallet is not connected, return a button which allows them to connect their wllet
    if (!walletConnected) {
      return (
        <div>
          <div class="connect-msg">
            <p class="welcome"> Welcome Back To Lit</p>
            <p class="connect-acct">
              Connect your account to get started with Lit
            </p>
          </div>
          <div class="connect-wallet" onClick={connectWallet}>
            <img src="./images/wallet.png" alt="" />
            <span>connect to wallet</span>
          </div>
          <p class="text-center">or use</p>
          <div class="icon-container">
            <div class="icons">
              <img
                src="./images/key.png"
                alt=""
                width="25px"
                class="image-png"
              />
            </div>

            <div class="icons">
              <img
                src="./images/ion_finger-print.png"
                alt=""
                width="25px"
                class="image-png png1"
              />
            </div>
          </div>
          <div class="keys">
            <p>ID Key</p>
            <p> Fingerprint</p>
          </div>

          <button class="btn-login" onClick={connectWallet}> Log in</button>
        </div>
      );
    } else {
      return (
        <div>
          
          <div class="connect-wallet">
            <img src="./images/wallet.png" alt="" />
            <h3>You are connected as {ens?ens:address}!</h3>
          </div>
        </div>
      );
    }

    // If we are currently waiting for something, return a loading button
    if (loading) {
      return <button className={styles.button}>Loading...</button>;
    }
  };

  useEffect(() => {
    // if wallet is not connected, create a new instance of Web3Modal and connect the MetaMask wallet
    if (!walletConnected) {
      // Assign the Web3Modal class to the reference object by setting it's `current` value
      // The `current` value is persisted throughout as long as this page is open
      web3ModalRef.current = new Web3Modal({
        network: "goerli",
        providerOptions: {},
        disableInjectedProvider: false,
      });
      connectWallet();
    }
  }, [walletConnected]);
  return (
    <div>
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
