const parseWords = (data, bboxes) => {
   try {
        const height = data.height
        const width = data.width
       
        data.words.forEach(word => { 
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
   } catch (error) {
      throw error;
   }
};

export default {
    parseWords
};