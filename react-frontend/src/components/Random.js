import React from 'react';
import axios from "axios";
import ExcerptFetch from "./ExcerptFetch";

const Random = () => <ExcerptFetch apiCall={() => randomAPICall()} />;

const randomAPICall = async () => {
    const response = await axios.get('/randomExcerpt');
    return response.data;
};

export default Random;
