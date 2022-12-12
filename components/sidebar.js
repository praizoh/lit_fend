import Link from "next/link";
import { useRouter } from "next/router";
// import styles from '../styles/globals.css';

const Sidebar = () => {
  const router = useRouter();
  const pathname = router.pathname;

  return (
    <header>
      <div className="items">
        <div className="taskbar">
          <Link href={"/dashboard"}>
            <div className="hand">
              <li className={pathname === "/dashboard" ? "active" : ""}>
                <img src="images/home.png" alt="home icon" />
                Home
              </li>
            </div>
          </Link>
          <Link href={"/explore-profiles"}>
            <div className="hand">
              <li className={pathname === "/explore-profiles" ? "active" : ""}>
                <img src="images/communities.png" alt="communities icon" />
                Profiles
              </li>
            </div>
          </Link>
          <Link href={"/my-activities"}>
            <div className="hand">
              <li className={pathname === "/my-activities" ? "active" : ""}>
                <img src="images/activities.png" alt="activities icon" />
                My Activities
              </li>
            </div>
          </Link>
          <Link href={"/create-post"}>
            <div className="hand">
              <li className={pathname === "/create-post" ? "active" : ""}>
                <img
                  src="images/create-post.png"
                  alt="create post"
                  className="createpost2"
                />
                Create post
              </li>
            </div>
          </Link>
        </div>
      </div>
    </header>
  );
};

export default Sidebar;
