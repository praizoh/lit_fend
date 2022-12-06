/* eslint-disable @next/next/no-img-element */
/* eslint-disable @next/next/no-page-custom-font */

import Head from "next/head";
import { useState, useEffect } from "react";
import { client, getPublicationById, GetDefaultProfile, getCommentsOfAPublication } from "../../api";
import { useRouter } from "next/router";
import Link from "next/link";
import {
  useAccount,
  useDisconnect,
  useEnsAvatar,
  useEnsName,
  useSigner,
} from "wagmi";
import { ethers, providers } from "ethers";
import {
  addressService,
  userService,
  profileService,
} from "../../services/userService";
const addressServiceData = addressService;
import {
  LENS_HUB_CONTRACT_ADDRESS,
  signCreateCommentTypedData,
} from "../../api_cql";
import LENSHUB from "../../abi/lenshub";
import { create } from "ipfs-http-client";
import { v4 as uuid } from "uuid";
import { refreshAuthToken, splitSignature } from "../../utils";
import { BehaviorSubject } from "rxjs";
const profileSubject = new BehaviorSubject(
  process.browser && JSON.parse(localStorage.getItem("profile"))
);
import moment from 'moment'
const projectId = process.env.NEXT_PUBLIC_PROJECT_ID;
const projectSecret = process.env.NEXT_PUBLIC_PROJECT_SECRET;
const auth =
  "Basic " + Buffer.from(projectId + ":" + projectSecret).toString("base64");

const clientQuery = create({
  host: "ipfs.infura.io",
  port: 5001,
  protocol: "https",
  headers: {
    authorization: auth,
  },
});

export default function Home() {
  const router = useRouter();
  const [post, setPost] = useState([]);
  const [comments, setComments] = useState([]);
  const { id } = router.query;

  const { address } = useAccount();
  const { data: ensName } = useEnsName({ address });
  const [userAddress, setUserAddress] = useState("");
  const [profile, setUserProfile] = useState();
  const [commentMessage, setCommentMessage] = useState("");
  const [isCommentCreated, setIsCommentCreated] = useState(false);
  const { data: signer } = useSigner({
    onError(error) {
      console.log("Error", error);
    },
  });

  useEffect(() => {
    fetchPost();
    fetchPostComments()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // eslint-disable-next-line react-hooks/exhaustive-deps

  useEffect(() => {
    setUserAddress(address);
    if (!userAddress) {
      return;
    }
    getDefaultProfile();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userAddress]); // eslint-disable-next-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (isCommentCreated) {
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isCommentCreated]); // eslint-disable-next-line react-hooks/exhaustive-deps

  async function getDefaultProfile() {
    try {
      console.log("calling default profile");
      console.log(userAddress);
      const response = await client
        .query(GetDefaultProfile, { address: userAddress })
        .toPromise();
      console.log(response);
      setUserProfile(response.data.defaultProfile);
      profileSubject.next(response.data.defaultProfile);
      localStorage.setItem(
        "profile",
        JSON.stringify(response.data.defaultProfile)
      );
    } catch (err) {
      console.log(err);
    }
  }

  async function uploadToIPFS() {
    const metaData = {
      version: "2.0.0",
      metadata_id: uuid(),
      content: commentMessage,
      description: commentMessage,
      name: `Comment by @${profile.handle}`,
      external_url: `https://lenster.xyz/u/${profile.handle}`,
      mainContentFocus: "TEXT_ONLY",
      attributes: [],
      locale: "en-US",
      tags: ["lit_app"],
      appId: "lit_app",
    };

    const added = await clientQuery.add(JSON.stringify(metaData));
    const uri = `https://ipfs.infura.io/ipfs/${added.path}`;
    return uri;
  }

  async function saveComment(e) {
    e.preventDefault();
    if (!profile) return;
    if (!signer) {
      console.log("signer is missing");
      return;
    }
    const contentURI = await uploadToIPFS();
    const { accessToken } = await refreshAuthToken();
    const createCommentRequest = {
      profileId: profile.id,
      publicationId: id,
      contentURI,
      collectModule: {
        revertCollectModule: true,
      },
      referenceModule: {
        followerOnlyReferenceModule: false,
      },
    };

    try {
      const signedResult = await signCreateCommentTypedData(
        createCommentRequest,
        accessToken
      );
      const typedData = signedResult.result.typedData;
      const { v, r, s } = splitSignature(signedResult.signature);

      const contract = new ethers.Contract(
        LENS_HUB_CONTRACT_ADDRESS,
        LENSHUB,
        signer
      );

      const tx = await contract.commentWithSig({
        profileId: typedData.value.profileId,
        contentURI: typedData.value.contentURI,
        profileIdPointed: typedData.value.profileIdPointed,
        pubIdPointed: typedData.value.pubIdPointed,
        collectModule: typedData.value.collectModule,
        collectModuleInitData: typedData.value.collectModuleInitData,
        referenceModule: typedData.value.referenceModule,
        referenceModuleInitData: typedData.value.referenceModuleInitData,
        referenceModuleData: typedData.value.referenceModuleData,
        sig: {
          v,
          r,
          s,
          deadline: typedData.value.deadline,
        },
      },{ gasLimit: 500000 });

      await tx.wait();
      console.log("successfully created comment: tx hash", tx.hash);
      alert("hopefully your comment has been created 🙈");
      setIsCommentCreated(true);
    } catch (err) {
      console.log("error: ", err);
    }
  }

  async function fetchPost() {
    console.log(id);
    try {
      const response = await client
        .query(getPublicationById, { id })
        .toPromise();
      console.log({ response });
      setPost(response.data.publication);
    } catch (err) {
      console.log(err);
    }
  }
  async function fetchPostComments() {
    console.log(id);
    try {
      const response = await client
        .query(getCommentsOfAPublication, { id })
        .toPromise();
      console.log({ response });
      setComments(response.data.publications.items);
    } catch (err) {
      console.log(err);
    }
  }
  if (!post) {
    return;
  }

  return (
    <div className="view-comments">
      <Head>
        <meta http-equiv="X-UA-Compatible" content="IE=edge" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Comments</title>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
        <link
          href="https://fonts.googleapis.com/css2?family=Manrope:wght@200;300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.2.1/css/all.min.css"
        />
      </Head>
      <main>
        <div className="content">
          <div className="contenthead">
            <img src="../images/web3logo.png" alt="" />
            <p className="web3cont">{post?.profile?.handle} || <small>{moment(post?.createdAt).fromNow()}</small></p>
          </div>
          <p>
            {post?.metadata?.content}
          </p>
          <br/>
          <p>-Product Design</p>
          <p>-Web3 Development</p>
          <p>-Web2 Development</p>
          <p>-Project Management</p>

          <p className="hashtags">
            #web3 #blockchain #polygon #meta #web2 #web3ladies #womenintech
          </p>
        </div>
        <hr />
        {comments.map((comment, index) => (
          <div className="all-comments" key={index}>
          <div className="read-comments">
            <div className="webcomment">
              <img src="../images/maureen.png" alt="" />
              <p className="usercomment">{comment?.profile?.name}||{comment?.profile.handle}</p>
              <p>
                {comment.metadata.description} 
              </p>
            </div>
            <div>{moment(comment?.createdAt).fromNow()}</div>
          </div>
        </div>
        ))}
        
        <div className="enter-comment">
          <img
            src="../images/profile-picture.png"
            alt=""
            width="35px"
            height="35px"
          />
          <textarea
            name="add-comment"
            id="type-comment"
            placeholder="Add a comment"
            onChange={(e) => setCommentMessage(e.target.value)}
          ></textarea>
          <i className="fa-solid fa-paper-plane hand" onClick={saveComment}></i>
        </div>
      </main>
    </div>
  );
}
