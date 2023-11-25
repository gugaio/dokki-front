import axios from 'axios'

const API_URL = 'http://localhost:3000/upload';
const RESIZE_URL = 'http://localhost:5000/resize';


const upload = async (file) => {
   return new Promise((resolve, reject)  => {
      let formData = new FormData();
      formData.append('file', file);
      axios.post(API_URL,
               formData,
               {
                  headers: {
                        'Content-Type': 'multipart/form-data',
                  },
               })
            .then((response) => {
               resolve(response.data);;
            })
            .catch((error) => {
               reject(error);
            });
   });
   
};

const resize = async (id) => {
   return new Promise((resolve, reject)  => {
      const data = {
         id: id
       };
      axios.post(RESIZE_URL,
               data,
               {
                  headers: {
                        'Content-Type': 'application/json',
                  },
               })
            .then((response) => {
               resolve(response);;
            })
            .catch((error) => {
               reject(error);
            });
   });
   
};


const uploadBlob = async (blob) => {
   return new Promise((resolve, reject)  => {
      try {
         let file = new File([blob], 'upload.jpeg', { type: 'image/jpeg' });
   
         let formData = new FormData();
         formData.append('file', file);
   
         axios.post(API_URL, formData, {
               headers: {
                  'Content-Type': 'multipart/form-data',
               },
            })
         .then(response => {
            resolve(response.data);
         })
         .catch(error => {
            console.error(error);
            reject(error);
         });
      } catch (error) {
         reject(error);
      }
   });
   
};

export default {
   upload, uploadBlob, resize
};