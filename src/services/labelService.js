import axios from 'axios'

const API_URL = 'http://127.0.0.1:5000/labels?agent=dokki&sender=guga&uuid=5894449e-95f5-44a3-8ad9-f7d0c7ed6242';
const sendOcrLabels = async (labelsMap) => {
   try {
        axios.post(API_URL, labelsMap)
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

export default {
    sendOcrLabels
};