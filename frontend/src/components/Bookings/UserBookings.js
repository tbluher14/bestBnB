import { useDispatch, useSelector } from "react-redux"
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { deleteBookingThunk, findAllBookingsThunk, findUserBookingsThunk } from "../../store/bookings"
import {listAllSpots} from '../../store/spot'




const UserBookings = () => {
    const dispatch = useDispatch()
    const [isLoaded, setIsLoaded] = useState(false)
    const bookings = useSelector(state => state.bookings)
    const bookingsArr = Object.values(bookings)


    const formatDate = (date) => {
        let newDate = new Date(date)
        return newDate.toDateString()
    }

    const handleDelete =  (ele) => {
      const alert = window.confirm('Are you sure you want to delete this spot?')
        console.log("this is ele arg in the handle delete", ele)
      if (alert) {
        dispatch(deleteBookingThunk(ele))
        .then(dispatch(findUserBookingsThunk()))
        .then(setIsLoaded(false))
      }
    }


    useEffect(() => {
        // dispatch(findAllBookingsThunk())
        dispatch(findUserBookingsThunk())
        dispatch(listAllSpots())
        setIsLoaded(true)
    }
    , [dispatch])

    return isLoaded && (
            <>
              <div className="all_spots">
                {bookingsArr?.map((ele) => (
                  <div className="single_spot" key={ele?.id}>
                    <h4 className="booking_dates_header">Booking Dates </h4>
                  <p className="booking_dates">{formatDate(ele?.startDate)} - {formatDate(ele?.endDate)}</p>
                    <div key={ele?.id}>
                      <div className="img">
                        <img
                          src={ele?.Spot?.previewImage}
                          alt={ele?.Spot?.name}
                          className="spot_image_display"
                          onError={e => {
                            e.currentTarget.src = "https://images.unsplash.com/photo-1546593064-053d21199be1?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1550&q=80"
                          }}
                        ></img>
                      </div>
                      <div className="spot_details">
                      <div className="spot_info">
                        <h3 className="spot_location">
                          {ele?.Spot?.city}, {ele?.Spot?.state}
                        </h3>
                        <div className="rating_star_container">
                        <i className="star_img" class="fa-solid fa-star" id="splash_page_star">
                          </i>
                        <div className="spot_rating" id="star_review_score">
                          <div className="rating_tern">
                          {ele?.avgRating === undefined ? "New!" : `${ele?.Spot?.avgRating} / 5`}
                          </div>
                          </div>
                      </div>
                        </div>
                        <p className="spot_price">${ele?.Spot?.price} / night</p>

                      </div>
                    </div>
                  {/* </Link> */}
                  <button onClick={() => handleDelete(ele)}>Cancel Booking</button>
                  </div>
                ))}
              </div>

            </>
          );
        };


export default UserBookings
