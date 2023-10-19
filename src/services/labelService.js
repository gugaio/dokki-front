import axios from 'axios'

const API_URL = 'http://127.0.0.1:3000/labels';
const sendOcrLabels = async (id, labelsMap) => {
   try {
      const url = `${API_URL}/${id}`;
        axios.post(url, labelsMap)
        .then(response => {
        console.log(response.data);
        })
        .catch(error => {
        console.error(error);
        });
   } catch (error) {
      throw error;
   }
};

const getOcrLabels = async (id) => {
   try {
      const url = `${API_URL}/${id}`;
      const response = await axios.get(url);
      return response.data;
   } catch (error) {
      throw error;
   }
}

export default {
    sendOcrLabels,
    getOcrLabels
};