import axios from 'axios'

const API_URL = 'http://127.0.0.1:3000/dataset';

const getDataset = async () => {
   try {
      const response = await axios.get(API_URL);
      return response.data;
   } catch (error) {
      throw error;
   }
}

export default {
   getDataset
};