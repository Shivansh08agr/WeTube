import React, { useEffect, useState } from "react";
import styles from "./Sidebar.module.scss";
import { NavLink } from "react-router-dom";

const Sidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  
  return (
    <>
      {(isCollapsed) ? (
        <div className={styles.sidebar}>
          <div className={styles.controls}>
            <div
              className={styles.collapseSidebar}
              onClick={()=> {
                setIsCollapsed(prev=>!prev);
              }}
            >
              <img src="/assets/Hamburger.svg" alt="Hamburger" draggable="false" />
              <p>Collapse Sidebar</p>
            </div>
            <NavLink to="/" className={styles.navlink}>
              <img src="/assets/Home.svg" alt="Home" draggable="false" />
              <p>Home</p>
            </NavLink>
            <NavLink to="/liked-videos" className={styles.navlink}>
              <img src="/assets/thumbs-up.svg" alt="liked videos" draggable="false" />
              <p>Liked Videos</p>
            </NavLink>
            <NavLink to="/watch-history" className={styles.navlink}>
              <img src="/assets/clock-rewind.svg" alt="History" draggable="false" />
              <p>History</p>
            </NavLink>
            <NavLink to="upload-video" className={styles.navlink}>
              <img src="/assets/MyContent.svg" alt="My Content" draggable="false" />
              <p>Upload Video</p>
            </NavLink>
            <NavLink to="my-videos" className={styles.navlink}>
              <img src="/assets/folder.svg" alt="Collection" draggable="false" />
              <p>My Videos</p>
            </NavLink>
            <NavLink to="#" className={styles.navlink}>
              <img src="/assets/Subscribers.svg" alt="Subscribers" draggable="false" />
              <p>Subscribers</p>
            </NavLink>
          </div>
          <div className={styles.settings}>
            <NavLink to="https://linktr.ee/ShivanshAgr08" className={styles.navlink} target="_blank">
              <img
                src="/assets/help-circle.svg"
                alt="About Developer"
                draggable="false"
              />
              <p>About Developer</p>
            </NavLink>
            <NavLink to="https://linktr.ee/ShivanshAgr08" className={styles.navlink} target="_blank">
              <img src="/assets/Settings.svg" alt="Settings" draggable="false" />
              <p>Settings</p>
            </NavLink>
          </div>
        </div>
      ) : (
        <div className={styles.sidebarShrunk}>
          <div className={styles.controls}>
            <div
              className={styles.collapseSidebar}
              onClick={()=>setIsCollapsed((prev) => !prev)}
            >
              <img src="/assets/Hamburger.svg" alt="Hamburger" draggable="false" />
            </div>
            <NavLink to="/" className={styles.navlink}>
              <img src="/assets/Home.svg" alt="Home" draggable="false" />
            </NavLink>
            <NavLink to="/liked-videos" className={styles.navlink}>
              <img src="/assets/thumbs-up.svg" alt="liked videos" draggable="false" />
            </NavLink>
            <NavLink to="/watch-history" className={styles.navlink}>
              <img src="/assets/clock-rewind.svg" alt="History" draggable="false" />
            </NavLink>
            <NavLink to="/upload-video" className={styles.navlink}>
              <img src="/assets/MyContent.svg" alt="My Content" draggable="false" />
            </NavLink>
            <NavLink to="my-videos" className={styles.navlink}>
              <img src="/assets/folder.svg" alt="Collection" draggable="false" />
            </NavLink>
            <NavLink to="#" className={styles.navlink}>
              <img src="/assets/Subscribers.svg" alt="Subscribers" draggable="false" />
            </NavLink>
          </div>
          <div className={styles.settings}>
            <NavLink to="https://linktr.ee/ShivanshAgr08" className={styles.navlink} target="_blank">
              <img
                src="/assets/help-circle.svg"
                alt="About Developer"
                draggable="false"
              />
            </NavLink>
            <NavLink to="https://linktr.ee/ShivanshAgr08" className={styles.navlink} target="_blank">
              <img src="/assets/Settings.svg" alt="Settings" draggable="false" />
            </NavLink>
          </div>
        </div>
      )}
    </>
  );
};

export default Sidebar;
