<template lang="">
   <header>
      <nav>
          <router-link to="/">
              <img src="/home_small.png" alt="Logo" />
          </router-link>
      </nav>
  </header>
  <div class="root" :style="{ maxWidth: imgMaxWidth, maxHeight:  imgMaxHeight}">
    <img :style="{ maxWidth: imgMaxWidth, maxHeight:  imgMaxHeight}" class="fileImage" :src="getImgUrl()" alt="">
    <div  v-for="box in bboxes" :class='{focusActive: box.active}' class="focus" :style='{left:box.x_px, top:box.y_px, height:box.height_px, width: box.width_px}' :title='box.value' :id='box.id' @click='handleBBoxClick(box.id, box.x, box.y, box.width, box.height, box.value)'>
    </div>
    <ul id="classifier" :class="{hidden: classifier.hidden}" class="classifier" :style='{left:classifier.x, top:classifier.y}'>
        <input type="text" v-model="classifier.text" />
        <li v-for="category in classifier.categories" @click='handleLabelingClick(category.value)'>{{category.name}}</li>
        <button @click='handleClearLabelClick()'>Limpar</button>
        <button @click='handleCloseLabelClick()'>Fechar</button>
    </ul>
    <div class="document-type-selector">
      <input type="radio" id="pagamento" value="pagamento" v-model="docType">
      <label for="pagamento">Pagamento</label>
      <input type="radio" id="notafiscal" value="notafiscal" v-model="docType">
      <label for="notafiscal">Nota Fiscal</label>
    </div>
    <button :class='{hidden: Object.keys(this.boxMap).length == 0}' @click='send()'>Enviar</button>
  </div>
</template>


<script>
import ocrService from '@/services/ocrService.js';
import ocrParser from '@/services/ocrParser.js';
import labelService from '@/services/labelService.js';
export default {
  data(){
    return {
      docType: '',
      imgMaxWidth: window.innerWidth + "px",
      imgMaxHeight: window.innerHeight + "px",
      ocr: {},
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
            name: "CPF",
            value: "cpf"
          },
          {
            name: "Total",
            value: "total"
          },
          {
            name: "Data",
            value: "data"
          }]
      },
      boxMap: {},
      textMistakes: {},
    }
  },
  methods: {
        getImgUrl() {
          return `http://localhost:3000/download/${this.$route.params.id}`;
        },
        handleBBoxClick(id, x, y, width, height, value) {
          if(this.classifier.hidden == false){
            return;
          }
          this.classifier.x = x + "px";
          this.classifier.y = (y + height) + "px";
          this.current_box_id = id;
          this.classifier.originalText = id in this.textMistakes ? this.textMistakes[id] : value;
          this.classifier.text = this.classifier.originalText
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
          this.textMistakes[this.current_box_id] = this.classifier.text

          this.bboxes.forEach(box => {
            if(box.id == this.current_box_id){
              box.active = true
            }
          });
          this.classifier.hidden = true;
        },
        handleClearLabelClick(){
          this.boxMap[this.current_box_id] = undefined
          this.textMistakes[this.current_box_id] = undefined
          this.bboxes.forEach(box => {
            if(box.id == this.current_box_id){
              box.active = false
            }
          });
          this.classifier.hidden = true;
        },
        handleCloseLabelClick(){
          this.classifier.hidden = true
          if(this.classifier.originalText !== this.classifier.text){
            this.textMistakes[this.current_box_id] = this.classifier.text
          }
          
        },
        async send(){          
          await labelService.sendOcrLabels(this.id, {ocr: this.ocr, labels: this.boxMap, textMistakes: this.textMistakes ,docType: this.docType});
          this.$router.push({ name: 'dataset' })          
        }
  },
  async created() {    
    this.id = this.$route.params.id;
    const ocrLabels = await labelService.getOcrLabels(this.id);

    this.docType = ocrLabels.docType || '';

    if(!ocrLabels.labels){
      this.ocr = await ocrService.getOCR(this.id);    
      const ratioW = window.innerWidth / this.ocr.width;
      const ratioH = window.innerHeight / this.ocr.height;
      const ratio = ratioW < ratioH ? ratioW : ratioH;
      
      this.imgMaxWidth=  (this.ocr.width*ratio) < window.innerWidth ? (this.ocr.width*ratio) + "px" : window.innerWidth + "px";
      ocrParser.parseWords(this.ocr, ratio).
        then((bboxes) => {
          this.bboxes.push(...bboxes);
        })
        .catch((err) => {
          console.log("err:", err)
        })
    }else{
      this.ocr = ocrLabels.ocr;
      this.boxMap = ocrLabels.labels;
      this.textMistakes = ocrLabels.textMistakes || {};
      const ratioW = window.innerWidth / this.ocr.width;
      const ratioH = window.innerHeight / this.ocr.height;
      const ratio = ratioW < ratioH ? ratioW : ratioH;
      
      this.imgMaxWidth=  (this.ocr.width*ratio) < window.innerWidth ? (this.ocr.width*ratio) + "px" : window.innerWidth + "px";
      ocrParser.parseWords(this.ocr, ratio).
      then((bboxes) => {
        this.bboxes.push(...bboxes);
        this.bboxes.forEach(box => {
          if(this.boxMap[box.id]){
            box.active = true
          }
        });
      })
      .catch((err) => {
        console.log("err:", err)
      })
      
    }
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
  object-fit: contain;
  position: relative;
  border-radius: 5px;
  display: block;
  margin-left: 0;
  -webkit-box-shadow: 5px 5px 5px 0px rgba(0,0,0,0.75);
  -moz-box-shadow: 5px 5px 5px 0px rgba(0,0,0,0.75);
  box-shadow: 5px 5px 5px 0px rgba(0,0,0,0.75);
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

.document-type-selector{
  margin: 10px;
}

</style>