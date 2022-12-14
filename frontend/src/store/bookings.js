import {csrfFetch} from './csrf'
const FIND_ALL_BOOKINGS = 'bookings/FIND_ALL_BOOKINGS';
const FIND_USER_BOOKINGS = 'bookings/FIND_USER_BOOKINGS';
const FIND_BY_SPOT_ID = 'bookings/FIND_BY_SPOT_ID';
const CREATE_BOOKING = 'bookings/CREATE_BOOKING';
const EDIT_BOOKING = 'bookings/EDIT_BOOKING';
const DELETE_BOOKING = 'bookings/DELETE_BOOKING';


const findAllBookingsAC = (bookings) => {
    return {
        type: FIND_ALL_BOOKINGS,
        bookings
    }
}

const findUserBookingsAC = (bookings) => {
    return {
        type: FIND_USER_BOOKINGS,
        bookings
    }
}

const getBookingsBySpotIdAC = (bookings) => {
    return {
        type: FIND_BY_SPOT_ID,
        bookings
    }
}


const createBookingAC = (booking) => {
    return {
        type: CREATE_BOOKING,
        booking
    }
}

const editBookingAC = (booking) => {
    return {
        type: EDIT_BOOKING,
        booking
    }
}

const deleteBookingAC = (bookingId) => {
    return {
        type: DELETE_BOOKING,
        bookingId
    }
}

// Thunks


// Create a booking based on spot id
export const createBookingThunk = (payload) => async (dispatch) => {
    const reqData = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
    }
    const response = await csrfFetch(`/api/spots/${payload.spotId}/bookings`, reqData)

    if (response.ok) {
        const data = await response.json();
        dispatch(createBookingAC(data));
    }
}

// Edit a booking based on booking id
export const editBookingThunk = (payload) => async (dispatch) => {
    const response = await csrfFetch(`/api/bookings/${payload.id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
    });
    if (response.ok) {
        const data = await response.json();
        dispatch(editBookingAC(data));
    }
}

// Delete a booking based on booking id
export const deleteBookingThunk = (bookingId) => async (dispatch) => {
    const response =  await csrfFetch(`/api/bookings/${bookingId}`, {
        method: "DELETE"
    });
    if (response.ok) {
        // const data = await response.json();
        dispatch(deleteBookingAC(bookingId));
    }
    return response
}

// Find bookings by spot id
export const getBookingsBySpotIdThunk = (spotId) => async dispatch => {
    const response = await csrfFetch(`/api/spots/${spotId}/bookings`);
    if (response.ok) {
        const bookings = await response.json()
        dispatch(getBookingsBySpotIdAC(bookings))
    }
}

// Find current user's bookings
export const findUserBookingsThunk = () => async dispatch => {
    const response = await csrfFetch(`/api/bookings/current`);

    if (response.ok) {
        const bookings = await response.json()
        dispatch(findUserBookingsAC(bookings))
    }
}


// Find all bookings
export const findAllBookingsThunk = () => async dispatch => {
    const response = await csrfFetch(`/api/bookings`);
    if (response.ok) {
        const bookings = await response.json()
        dispatch(findAllBookingsAC(bookings))
    }
}

// Reducer
const initialState = {};
const bookingsReducer = (state = initialState, action) => {
    let newState;
    switch (action.type) {
        case FIND_BY_SPOT_ID:
            newState = {...action.bookings.Bookings}
            return newState
        case FIND_USER_BOOKINGS:
            newState = {...action.bookings}
            return newState
        case FIND_ALL_BOOKINGS:
            newState = {...action.bookings}
            return newState
        case CREATE_BOOKING:
            newState = { ...state };
            newState[action.booking?.booking?.id] = action.booking?.booking;
            return newState;
        case EDIT_BOOKING:
            newState = { ...state };
            newState[action.booking.id] = action.booking;
            return newState;
        case DELETE_BOOKING:
            newState = { ...state};
            console.log("this is new state", newState)
            console.log("this is action", action)
            delete newState[action.bookingId];
            return newState;
        default:
            return state;
    }
}

export default bookingsReducer;
