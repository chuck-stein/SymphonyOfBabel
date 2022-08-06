import React from 'react';
import axios from "axios";
import ExcerptFetch from "./ExcerptFetch";

// The Random component wraps an ExcerptFetch component whose API call requests a random audio excerpt.
const Random = () => <ExcerptFetch apiCall={() => randomAPICall()} />;

/**
 * Make an HTTP request to get a random audio excerpt.
 * @returns {Promise<Object>} the response data of the request, containing the random audio excerpt and its ID
 */
const randomAPICall = async () => {
    const response = await axios.get('/randomExcerpt');
    return response.data;
};

export default Random;
