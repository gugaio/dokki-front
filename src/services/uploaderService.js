import axios from 'axios'

const API_URL = 'http://localhost:3000/upload?agent=dokki&sender=guga';
const uploadBlob = async (blob) => {
   return new Promise((resolve, reject)  => {
      try {
         let file = new File([blob], 'test.png', { type: 'image/jpeg' });
   
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
   uploadBlob
};