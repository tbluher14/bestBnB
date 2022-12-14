import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { useHistory, useParams } from "react-router-dom";
import {  thunkUpdateImage } from "../../store/spot";
import { editASpot, findSpotById, listAllSpots } from "../../store/spot";
import './EditSpot.css'

const EditSpot = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  let { spotId } = useParams();
  spotId = Number(spotId);
  const [errors, setErrors] = useState([]);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [selectedSpot, setSelectedSpot] = useState({})
  const updateName = (e) => setSelectedSpot({...selectedSpot, name:e.target.value});
  const updateAddress = (e) => setSelectedSpot({...selectedSpot, address:e.target.value});
  const updateCity = (e) => setSelectedSpot({...selectedSpot, city:e.target.value});
  const updateState = (e) => setSelectedSpot({...selectedSpot, state:e.target.value});
  const updateCountry = (e) => setSelectedSpot({...selectedSpot, country:e.target.value});
  const updatePrice = (e) => setSelectedSpot({...selectedSpot, price:e.target.value});
  const updateLat = (e) => setSelectedSpot({...selectedSpot, lat:e.target.value});
  const updateLng = (e) => setSelectedSpot({...selectedSpot, lng:e.target.value});
  const updateDescription = (e) => setSelectedSpot({...selectedSpot, description:e.target.value});
  const updateTagA = (e) => setSelectedSpot({...selectedSpot, tagA:e.target.value});
  const updateTagB = (e) => setSelectedSpot({...selectedSpot, tagB:e.target.value});

  const [previewImage, setPreviewImage] = useState('')

useEffect(() => {
  async function fetchData() {
    const response = await dispatch(findSpotById(spotId));
    setSelectedSpot(response)
  }
  fetchData();

}, [dispatch, history, spotId])


// --------------------------------------------------------------------------------------------------
// HANDLE SUBMIT
  const handleSubmit = async (e) => {
    e.preventDefault();

    // if preview image IS NOT changing
    if (previewImage.length < 1) {
      e.preventDefault()
      return dispatch(editASpot(selectedSpot, spotId))
      .then((res) => {
        setSubmitSuccess(true)

        dispatch(listAllSpots())
      })
      .catch(async (res) => {
          setSubmitSuccess(false)
          const data = await res.json();

          if (data && data.errors) {
            setErrors(Object.values(data.errors))
          }
      })
    }

    // if preview image changes:
    if (previewImage.length > 1){
      await dispatch(thunkUpdateImage(selectedSpot.id, selectedSpot.id, previewImage))
      e.preventDefault()
      // to do: clear state
      // await dispatch(clearState())

      return dispatch(editASpot(selectedSpot, spotId))

      .then((res) => {
      setSubmitSuccess(true)

      dispatch(listAllSpots())
    })
    .catch(async (res) => {
        const data = await res.json();
        setSubmitSuccess(false)

        if (data.errors) {setErrors(Object.values(data.errors))}
    })
  }
}

// --------------------------------------------------------------------------------------------------
const submitHelper = async (spotId) =>{
  // await dispatch(clearState())
  history.push(`/spots/${spotId}`)
}

if (submitSuccess) {
  // try down here too on clear state
  // await dispatch(clearState())
  // history.push(`/spots/${spotId}`)
  submitHelper(spotId)
}

// JSX
// --------------------------------------------------------------------------------------------------
  return (

    <form className="edit_spot" onSubmit={handleSubmit}>
      <h2 className="edit_header">Edit My Spot</h2>
        <div className="edit_spot_container">
      <ul className="edit_spot_errors">
        {errors.map((error, idx) => (
          <li key={idx}>{error}</li>
          ))}
      </ul>
        <label className="edit_address_container">
         <span className="edit_spot_text"> Spot Name: </span>
        <input
          className="edit_spot_input"
          type="text"
          placeholder="Spot Name"
          value={selectedSpot.name}
          onChange={updateName}
          required
          />
      </label>

      <label className="edit_address_container">
        <span className="edit_spot_text">Address:</span>
        <input
          className="edit_spot_input"
          type="text"
          placeholder="Address"
          value={selectedSpot.address}
          onChange={updateAddress}
          required
        />
      </label>
      <label className="edit_address_container">
        <span className="edit_spot_text">City:</span>
        <input
          className="edit_spot_input"
          type="text"
          placeholder="City"
          value={selectedSpot.city}
          onChange={updateCity}
          required
        />
      </label>
      <label className="edit_address_container">
        <span className="edit_spot_text">State:</span>
        <input
          className="edit_spot_input"
          type="text"
          placeholder="State"
          value={selectedSpot.state}
          onChange={updateState}
          required
        />
      </label>
      <label className="edit_address_container">
        <span className="edit_spot_text">Country:</span>
        <input
          className="edit_spot_input"
          type="text"
          placeholder="Country"
          value={selectedSpot.country}
          onChange={updateCountry}
          required
        />
      </label>
      <label className="edit_address_container">
        <span className="edit_spot_text">Latitude:</span>
        <input
          className="edit_spot_input"
          type="text"
          placeholder="Latitude"
          value={selectedSpot.lat}
          onChange={updateLat}
          required
        />
      </label>
      <label className="edit_address_container">
        <span className="edit_spot_text">Longitude:</span>
        <input
          className="edit_spot_input"
          type="text"
          placeholder="Longitude"
          value={selectedSpot.lng}
          onChange={updateLng}
          required
        />
      </label>
      <label className="edit_address_container">
        <span className="edit_spot_text">Spot Description:</span>
        <input
          className="edit_spot_input"
          type="textarea"
          rows="10"
          cols='30'
          value={selectedSpot.description}
          onChange={updateDescription}
          required
        />
      </label>
      <label className="edit_address_container">
        <span className="edit_spot_text">Price Per Night:</span>
        <input
          className="edit_spot_input"
          type="text"
          placeholder="Price"
          value={selectedSpot.price}
          onChange={updatePrice}
          required
        />
          </label>
        <label className="edit_address_container">
         <span className="edit_spot_text"> Image Url:</span>
          <input
            className="edit_spot_input"
            type="text"
            placeholder="img-url"
            value={previewImage}
            onChange={(e) => setPreviewImage(e.target.value)}

          />
      </label>
      <label className="address_container">
        Tags:
          <select
            value={selectedSpot.tagA}
            placeholder="tags"
            className="tag_drop"
            onChange={updateTagA}
            required
            >
           <option value="Mountains">Mountains</option>
           <option value="Forest">Forest</option>
           <option value="Cabin">Cabin</option>
           <option value="Close to Skiing">Close to Skiing</option>
           <option value="Secluded">Secluded</option>
           <option value="Wifi Available">Wifi Available</option>
           <option value="Ski-In/Ski-Out">Ski-In/Ski-Out</option>
           <option value="Hot Tub">Hot Tub</option>
        </select>
            </label>
        <label className="address_container">
        Tags:
          <select
            value={selectedSpot.tagB}
            className="tag_drop"
            placeholder="tags"
            onChange={updateTagB}
            required
            >
           <option value={"Mountains"}>Mountains</option>
           <option value={"Forest"}>Forest</option>
           <option value={"Cabin"}>Cabin</option>
           <option value={"Close to Skiing"}>Close to Skiing</option>
           <option value={"Secluded"}>Secluded</option>
           <option value={"Wifi Available"}>Wifi Available</option>
           <option value="Ski-In/Ski-Out">Ski-In/Ski-Out</option>
           <option value="Hot Tub">Hot Tub</option>
          </select>
            </label>
      <button type="submit" className="submit_edits">Confirm Changes</button>
      </div>
    </form>
  );
};

export default EditSpot;
