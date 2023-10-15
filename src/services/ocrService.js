import axios from 'axios'

const API_URL = `http://127.0.0.1:5000/singlepage`;
const getOCR = async (uuid, extension="") => {
   try {
      const url = `${API_URL}/${uuid}?extension=${extension}`;
      const response = await axios.get(url);
      return response.data;
   } catch (error) {
      throw error;
   }
};

export default {
    getOCR
};