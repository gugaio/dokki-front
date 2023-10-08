import axios from 'axios'

const API_URL = 'http://127.0.0.1:5000/singlepage?agent=dokki&sender=guga&uuid=5894449e-95f5-44a3-8ad9-f7d0c7ed6242';
const getOCR = async () => {
   try {
      const response = await axios.get(API_URL);
      return response.data;
   } catch (error) {
      throw error;
   }
};

export default {
    getOCR
};