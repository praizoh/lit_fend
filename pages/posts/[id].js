/* eslint-disable @next/next/no-img-element */


import Head from "next/head";
import { useState, useEffect } from "react";
import { client, getPublicationById } from "../../api";
import { useRouter } from "next/router";


export default function Home() {
  const router = useRouter();
  const [post, setPost] = useState([]);
  const { id } = router.query;

  useEffect(() => {
    fetchPost();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);     // eslint-disable-next-line react-hooks/exhaustive-deps


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
  return (
    <div className="view-comments">
      <Head>
        <meta charset="UTF-8" />
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
            <p className="web3cont">{post.profile.handle}</p>
          </div>
          <p>
            Web3Ladies partners with Polygon for cohort III Mentorship Program
            to empower women in tech. The followings tracks are available;
          </p>
          <p>-Product Design</p>
          <p>-Web3 Development</p>
          <p>-Web2 Development</p>
          <p>-Project Management</p>

          <p className="hashtags">
            #web3 #blockchain #polygon #meta #web2 #web3ladies #womenintech
          </p>
        </div>
        <hr />
        <div className="all-comments">
          <div className="read-comments">
            <div className="webcomment">
              <img src="../images/maureen.png" alt="" />
              <p className="usercomment">Maureen</p>
              <p>
                I can&apos;t wait to join the next cohort 😍😍, staying glued to this
                page
              </p>
            </div>
          </div>
          <div className="reply">
            <p>Reply</p>
            <p>Send</p>
          </div>
          <div className="webcomment">
            <img src="../images/girl1.png" alt="" />
            <p className="usercomment">Cherish</p>
            <p>Come check this out @Zainab.eth @kelly_xo @code.queen.git</p>
          </div>
          <div className="reply">
            <p>Reply</p>
            <p>Send</p>
          </div>
          <div className="webcomment">
            <img src="../images/profile-picture.png" alt="" />
            <p className="usercomment">Zainab.eth</p>
            <p>
              I&apos;m currently in the project phase of this program and i can&apos;t
              wait to present it to polygon.💃💃💃
            </p>
          </div>
          <div className="reply">
            <p>Reply</p>
            <p>Send</p>
          </div>
          <div className="webcomment">
            <img src="../images/cordon.png" alt="" />
            <p className="usercomment">Cordon</p>
            <p>
              Keep up the ggod work ladies, i can&apos;t wait to see what you are
              building. rooting for you all
            </p>
          </div>
          <div className="reply">
            <p>Reply</p>
            <p>Send</p>
          </div>
          <div className="webcomment">
            <img src="../images/girl1.png" alt="" />
            <p className="usercomment">Gifty.nft</p>
            <p>Web3Ladies to the world ✌✌✌, best bootcamp ever.</p>
          </div>
          <div className="reply">
            <p>Reply</p>
            <p>Send</p>
          </div>
        </div>
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
          ></textarea>
          <i className="fa-solid fa-paper-plane"></i>
        </div>
      </main>
    </div>
  );
}
