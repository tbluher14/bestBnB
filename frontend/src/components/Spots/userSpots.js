import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import  {getCurrentUsersSpots}  from "../../store/spot";
import './userSpots.css'

const UsersSpots = () => {
  const dispatch = useDispatch();
  const userSpotsObj = useSelector(state => state.spots);


  const userSpots = Object.values(userSpotsObj); //changing to array to .map


  useEffect(() => {
    dispatch(getCurrentUsersSpots());

  }, [dispatch]);

  if (userSpots.length === 0) {
    return <p>Oh no! No properties yet.</p>;
  }

  return (
    <div>
      <h2 className="my_spots_title">My Spots</h2>
      {userSpots.map((ele) => (
        <Link to={`/spots/${ele.id}`} key={ele.id}>
          <div key={ele.id} className="users_spots">
            <div>
              <img
              src={ele.previewImage}
              alt={ele.name}
              onError={e => {
                e.currentTarget.src = "https://images.unsplash.com/photo-1546593064-053d21199be1?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1550&q=80"
              }}
              ></img>
            </div>
            <div>
              <h3>{ele.name}</h3>
              <h4>
                {ele.city}, {ele.state}
              </h4>
              <p>{ele.description}</p>
              <p> Price: ${ele.price}/night</p>
              <div className="spots-rating" id="star_review_score">

              </div>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
};


export default UsersSpots
