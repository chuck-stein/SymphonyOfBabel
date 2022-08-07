import React, { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import LoadScreen from "./LoadScreen";

// The ExcerptFetch component makes an API call to get an audio excerpt. It shows a loading screen until it gets a
// response, then redirects to an Excerpt component with the audio excerpt info it received, or shows an error message
// if there is no such excerpt info.
const ExcerptFetch = (props) => {
  // Whether the audio excerpt is currently being loaded
  const [loading, setLoading] = useState(true);
  // Whether the HTTP request received an error response when looking for the audio excerpt
  const [failed, setFailed] = useState(false);
  // A message indicating to the user that fetching the audio excerpt was unsuccessful
  const [failMessage, setFailMessage] = useState(
    "Failed to retrieve excerpt info -- unknown error."
  );
  // The ID of the excerpt being fetched
  const [id, setID] = useState("");
  // The audio data of the excerpt being fetched
  const [bufferData, setBufferData] = useState([]);

  const apiCall = props.apiCall

  // Make the API call for finding the audio excerpt
  useEffect(() => {
    const getExcerptInfo = async () => {
      try {
        const data = await apiCall();
        setBufferData(data.excerptData);
        setID(data.excerptID);
        setLoading(false);
      } catch (err) {
        setFailMessage("Failed to retrieve excerpt info -- " + err.toString());
        setFailed(true);
      }
    };
    getExcerptInfo();
  }, [apiCall]);

  if (failed) {
    return <h1>{failMessage}</h1>;
  }
  return loading ? (
    <LoadScreen />
  ) : (
    <Navigate
      to="/excerpt"
      state={{
        id: id,
        bufferData: bufferData,
      }}
    />
  );
};

export default ExcerptFetch;
