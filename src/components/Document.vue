<template lang="">
  <div class="root" >
    <img :style="{ maxWidth: imgMaxWidth }" class="fileImage" :src="getImgUrl()" alt="">
    <div  v-for="box in bboxes" :class='{focusActive: box.active}' class="focus" :style='{left:box.x_px, top:box.y_px, height:box.height_px, width: box.width_px}' :id='box.id' @click='handleBBoxClick(box.id, box.x, box.y, box.width, box.height)'>
    </div>
    <ul id="classifier" :class="{hidden: classifier.hidden}" class="classifier" :style='{left:classifier.x, top:classifier.y}'>
        <li v-for="category in classifier.categories" @click='handleLabelingClick(category.value)'>{{category.name}}</li>
        <button @click='classifier.hidden = true'>Fechar</button>
    </ul>
    <button :class='{hidden: this.bboxes.length == 0}' @click='send()'>Enviar</button>
  </div>
</template>


<script>
import ocrService from '@/services/ocrService.js';
import ocrParser from '@/services/ocrParser.js';
import labelService from '@/services/labelService.js';
export default {
  data(){
    return {
      imgMaxWidth: window.innerWidth + "px",
      bboxes: [],
      current_box_id: -1,
      classifier: {
        x: "0px",
        y: "0px",
        hidden: true,
        categories: [
          {
            name: "CNPJ",
            value: "cnpj"
          },
          {
            name: "Total",
            value: "total"
          }]
      },
      boxMap: {},
    }
  },
  methods: {
        getImgUrl() {
          return `http://localhost:3000/download/${this.$route.params.id}`;
        },
        handleBBoxClick(id, x, y, width, height) {
          if(this.classifier.hidden == false){
            return;
          }
          
          this.classifier.x = x + "px";
          this.classifier.y = (y + height) + "px";
          this.current_box_id = id;
          this.showClassifier()          
         
          setTimeout(() => {
            let classifierWidth = document.getElementById('classifier').offsetWidth;
            if(x > window.innerWidth / 2){
              this.classifier.x = (x- classifierWidth) + "px";
            }else{
              console.log("No fix need")
            }
          }, 100);
          
        },
        showClassifier(){
          this.classifier.hidden = false;
        },
        handleLabelingClick(category){
          this.boxMap[this.current_box_id] = category
          this.bboxes.forEach(box => {
            if(box.id == this.current_box_id){
              box.active = true
            }
          });
          console.log("boxMap:", this.boxMap)
          this.classifier.hidden = true;
        },
        send(){
          labelService.sendOcrLabels(this.boxMap)
        }
  },
  async created() {    
    this.id = this.$route.params.id;    
    const ocr = await ocrService.getOCR(this.id);    
    const ratio = window.innerWidth / ocr.width;
    ocrParser.parseWords(ocr, ratio).
      then((bboxes) => {
        this.bboxes.push(...bboxes);
      })
      .catch((err) => {
        console.log("err:", err)
      })
  }
}

</script>
<style>
.root{
  position: relative;
  margin-left: auto;
  margin-right: auto;
}
.fileImage{
  border-radius: 5px;
  display: block;
  margin-left: 0;
  -webkit-box-shadow: 5px 5px 5px 0px rgba(0,0,0,0.75);
  -moz-box-shadow: 5px 5px 5px 0px rgba(0,0,0,0.75);
  box-shadow: 5px 5px 5px 0px rgba(0,0,0,0.75);
  width:100%;
}
.focus{
  width: 50px;
  height: 10px;
  background-color: red;
  position: absolute;
  left: 50px;
  top: 50px;
  opacity: 0.35;
}
.focus:hover {
  background-color: green;
  cursor: pointer;
}
.focusActive{
  background-color: green;
}
.classifier{
  border: solid 1px #BBBBBB;
  background-color: white;
  position: absolute;
  margin-left: auto;
  margin-right: auto;
  -webkit-box-shadow: 10px 10px 5px 0px rgba(0, 0, 0, 0.50);
  -moz-box-shadow: 10px 10px 5px 0px rgba(0,0,0,0.50);
  box-shadow: 10px 10px 5px 0px rgba(0,0,0,0.50);
  border-radius: 5px;
  font: 400 18px Roboto;
  white-space: nowrap;
  cursor: default;
  font-size: 1.5em;
}

.classifier li {
  list-style: none;
  padding: .5em;
  margin: 0;
  position: relative;
  cursor: pointer;
  &:hover {
    background-color: green
  }
}

.hidden {
  display: none;
  visibility: hidden;
}

</style>