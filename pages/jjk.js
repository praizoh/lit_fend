/* eslint-disable @next/next/no-img-element */
/* eslint-disable @next/next/no-page-custom-font */
import Head from "next/head";
import Link from "next/link";

import Sidebar from "../components/sidebar";

export default function Home() {
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
        <div className="dasboard dashnav">
          <div className="navbars">
            <div className="nav">
              <img
                src="images/Logo.png"
                alt="logo"
                width="32px"
                height="32px"
                className="dashlogo"
              />
              <Link href={`/my-profile`}>
                <div className={"hand"}>
                  <img
                    src="images/profile-picture.png"
                    alt="profile"
                    width="32px"
                    height="32px"
                    id="side-p"
                  />
                  {/* {ensName && <span>{ensName}</span>}
                  {!ensName && <span>{truncateEthAddress(userAddress)}</span>} */}
                </div>
              </Link>
            </div>
            <Sidebar />
          </div>
        </div>
      </main>
    </div>


  );
}
