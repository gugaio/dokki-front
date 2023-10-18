const parseWords = (ocr, ratio) => {
   return new Promise((resolve, reject) => {
      try {
         let bboxes = [];
         const height = ocr.height * ratio;
         const width = ocr.width * ratio;
         ocr.words.forEach(word => { 
         let box = {
               x: (word.geometry[0][0] * width),
               y: word.geometry[0][1] * height,
               width: ((word.geometry[1][0] - word.geometry[0][0]) * width),
               height: ((word.geometry[1][1] - word.geometry[0][1]) * height),
               x_px: (word.geometry[0][0] * width) + "px",
               y_px: word.geometry[0][1] * height + "px",
               width_px: ((word.geometry[1][0] - word.geometry[0][0]) * width) + "px",
               height_px: ((word.geometry[1][1] - word.geometry[0][1]) * height) + "px",
               id: word.id,
               active: false
         }
         bboxes.push(box)  
         });
         resolve(bboxes);
      } catch (error) {
         reject(error);
      }
   }
   );
};

export default {
    parseWords
};