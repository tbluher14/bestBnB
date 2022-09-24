// frontend/src/components/Navigation/ProfileButton.js
import React, { useState, useEffect } from "react";
import { useDispatch } from 'react-redux';
import { NavLink } from "react-router-dom";
import * as sessionActions from '../../store/session';
import './ProfileButton.css'

function ProfileButton({ user }) {
  const dispatch = useDispatch();
  const [showMenu, setShowMenu] = useState(false);

  const openMenu = () => {
    if (showMenu) return;
    setShowMenu(true);
  };

  useEffect(() => {
    if (!showMenu) return;

    const closeMenu = () => {
      setShowMenu(false);
    };

    document.addEventListener('click', closeMenu);

    return () => document.removeEventListener("click", closeMenu);
  }, [showMenu]);

  const logout = (e) => {
    e.preventDefault();
    dispatch(sessionActions.logout());
  };

  const showUsersSpots = (e) => {};
  const showUsersReviews = (e) => {};

  return (
    <>
    <div>
      <button className="loggedIn_menu" onClick={openMenu}>
        <i className="fas fa-bars nav_bars_icon"></i>
        <i className="fas fa-user-circle user_icon"></i>
      </button>
      <div className="menu_modal">
      {showMenu && (
        <div className="menu_container">
        <div className="menu">
          <NavLink to="/currentUser/spots" >
            {/* <button onClick={showUsersSpots} className="userSpots_button">My spots</button> */}
            My Spots
          </NavLink>
          <NavLink to="/reviews/current">
            {/* <button onClick={showUsersReviews} className="userReviews_button">My Reviews</button> */}
          My Reviews</NavLink>

          <button onClick={logout} className="logOut_button">
            Log Out
          </button>
          {/* <p>Hello {user.username}!</p>
          <p>Email: {user.email}</p> */}
          </div>
        </div>
      )}
      </div>
    </div>
  </>
  );
}

export default ProfileButton;
