import axios from 'axios'

const API_IMG_URL = `http://127.0.0.1:3000/download`;
const API_OCR_URL = `http://127.0.0.1:5000/singlepage`;

const getOCR = async (uuid) => {
   return new Promise((resolve, reject)  => {
      const img_url = `${API_IMG_URL}/${uuid}`;
      axios.get(img_url, { responseType: 'arraybuffer' }).then(imgResponse => {
        const data = new Uint8Array(imgResponse.data);

        // Get the size of the image
        const imageSize = data.length;

        // Print the image size
        console.log(`Image Size: ${imageSize} bytes`);
        

        // Create a Blob from the response data
        const blob = new Blob([imgResponse.data], { type: 'image/jpeg' });

        // Create FormData and append the Blob
        const formData = new FormData();
        formData.append('image', blob, 'image.jpeg');

        // Make a POST request using Axios
        axios.post(API_OCR_URL, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        })
        .then(response => {
          // Handle the response
          debugger
          resolve(response.data);
        })
        .catch(error => {
          // Handle the error
          reject('Error uploading image', error);
        });
        }
 
      ).catch(error => {
          reject('Error downloading image', error);
        }
      );
    });
};

export default {
    getOCR
};