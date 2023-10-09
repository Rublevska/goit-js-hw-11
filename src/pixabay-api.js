import axios from 'axios';
const API_KEY = '39900013-82e79eee519eb27086eb14dd9';
const BASE_URL = 'https://pixabay.com/api/';

async function findImages(requestWord, perPage, pageNumber = 1) {
  const params = {
    key: API_KEY,
    image_type: 'photo',
    orientation: 'horizontal',
    safesearch: 'true',
    per_page: perPage,
    q: requestWord,
    page: pageNumber,
  };

  const resp = await axios.get(BASE_URL, { params });
  return resp.data;
}

export { findImages };
