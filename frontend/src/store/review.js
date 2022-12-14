import { csrfFetch } from "./csrf";

const FIND_SPOT_REVIEWS = "spot/FIND_SPOT_REVIEWS";
const FIND_ALL_REVIEWS = 'reviews/findAllReviews';
const FIND_MY_REVIEWS = "spot/FIND_MY_REVIEWS";
const CREATE_REVIEW = "reviews/CREATE_REVIEW";
const EDIT_REVIEW = 'reviews/EDIT_REVIEW'
const DELETE_REVIEW = "reviews/DELETE_REVIEW";

const findSpotReviews = (payload) => {
  return {
    type: FIND_SPOT_REVIEWS,
    payload,
  };
};

const findMyReviews = (payload) => {
  return {
    type: FIND_MY_REVIEWS,
    payload,
  };
};

const createAReview = (payload) => {
  return {
    type: CREATE_REVIEW,
    payload,
  };
};

const editReviewAC = (review) => {
  return {
    type: EDIT_REVIEW,
    review,
  };
};

const deleteAReview = (payload) => {
  return {
    type: DELETE_REVIEW,
    payload,
  };
};

const findAllReviewsAC = (payload) => {
  return {
    type: FIND_ALL_REVIEWS,
    payload,
  };
}

// Thunks
export const getSpotReviews = (spotId) => async (dispatch) => {
  const response = await csrfFetch(`/api/spots/${spotId}/reviews`);
  if (response) {
    const data = await response.json();

    dispatch(findSpotReviews(data));

    return data;
  }
  else {
    return
  }
};

export const getAllReviewsThunk = () => async (dispatch) => {
  const response = await csrfFetch(`/api/reviews`);
  if (response) {
    const data = await response.json()
    dispatch(findAllReviewsAC(data))
    return data
  }
}

export const getUserReviews = () => async (dispatch) => {
  const response = await csrfFetch(`/api/reviews/current`);
  if (response.ok) {
    const data = await response.json();
    dispatch(findMyReviews(data));
  }
  return response;
};

export const deleteReview = (reviewId) => async (dispatch) => {
  const response = await csrfFetch(`/api/reviews/${reviewId}`, {
    method: "DELETE",
  });
  const deletedReview = await response.json();
  dispatch(deleteAReview(reviewId));
  return deletedReview;
};

export const createNewReview = (data, spotId) => async (dispatch) => {
  const response = await csrfFetch(`/api/spots/${spotId}/reviews`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (response.ok) {
    const review = await response.json();
    dispatch(createAReview(review));
    return review;
  }
};

export const editReview = (reviewId, data) => async (dispatch) => {
  const response = await csrfFetch(`/api/reviews/${reviewId}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (response.ok) {
    const review = await response.json();
    dispatch(editReviewAC(review));
    return review;
  }
};


const initialState = {};

const reviewsReducer = (state = initialState, action) => {
  let newState;
  switch (action.type) {
    case FIND_SPOT_REVIEWS: {
      newState = {};
      if (Array.isArray(action.payload)){
      action.payload.forEach((review) => (newState[review.id] = review));
    }
    return newState;
    }
  case FIND_MY_REVIEWS: {
      newState = {};
      action.payload.forEach((review) => (newState[review.id] = review));
      return newState;
    }
  case FIND_ALL_REVIEWS: {
    newState = {};
    action.payload.forEach((review) => (newState[review.id] = review));
    return newState;
  }
  case DELETE_REVIEW:
      newState = { ...state };
      delete newState[action.payload.spotId];
      return newState;
  case CREATE_REVIEW: {
      newState = { ...state };
      newState[action.payload.id] = action.payload;
      return newState;
      }
  case EDIT_REVIEW: {
      newState = { ...state };
      newState[action.review.id] = action.review;
      return newState;
    }
    default:
      return state;
  }
};

export default reviewsReducer;
