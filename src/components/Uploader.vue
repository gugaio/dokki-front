<template lang="">
    <div class="uploader-root">  
        <form v-show="!previewImage">
            <div class="uploader-selector">
                <img id="upload" src="/upload.jpg" alt="Upload"/>
                <label for="file">Selecionar nota</label>
                <input id="file" type="file" @change="onFileChange"  @onclick="this.value=null"/>
            </div>
        </form>    
        <div class="uploader-preview" v-show="previewImage">
            <img :src="previewImage" alt="Preview" />
        </div>               
        <div class="uploader-submit" v-if="fileData" v-show="previewImage">
            <label class="uploader-reload" for="file">
                <img src="/reload-removebg-small.png" alt="Reload" />
            </label>
            <button @click="uploadFile" v-if="fileData" >
                <img src="/confirm30.png" alt="Confirm" />
            </button>
        </div>        
  </div>
</template>

<script>
import documentService from '@/services/documentService.js';
export default {

    data() {
        return {
            fileData: null,
            previewImage: null
        }
    },
    methods: {
        onFileChange(event) {
            this.fileData = event.target.files[0];
            this.previewImage = null;
            if (this.fileData) {
                this.previewImage = URL.createObjectURL(this.fileData);
            }
        },
        uploadFile() {
            if (!this.fileData) return;

            documentService.upload(this.fileData)
            .then(data => {
                this.$router.push({ name: 'doc', params: { id: data.id }})
            })
            .catch(e => {
                console.log(e);
            });
        },
        
    },
    
}
</script>
<style>
    .uploader-root {
        margin-left: auto;
        margin-right: auto;
        margin-top: 50px;
    }
    input[type="file"] {
        display: none;
    }
    .uploader-selector {
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: center;        
        background-color: white;        
        border-radius: 10px;
        width: 200px;
        padding: 20px;
        margin-left: auto;
        margin-right: auto;
        filter: drop-shadow(-4px 4px 4px rgba(0, 0, 0, 0.75));
        cursor: pointer;
    }
    .uploader-selector img {
        width: 36px;
        height: 30px;
        display: block;
    }
    .uploader-preview {   
        max-width: 400px;
        margin-left: auto;
        margin-right: auto;
    }
    .uploader-preview img {
        max-width: 360px;
        display: block;
        margin-left: auto;
        margin-right: auto;
    }
    .uploader-reload{
        background-color: white;
        border-radius: 50%;
        width: 60px;
        height: 60px;
        margin: 10px;
        padding: 15px 0;
    }
    .uploader-submit{
        padding: 20px;
        display: flex;
        align-items: center;
        justify-content: center;
    }
    .uploader-submit button{
        border-radius: 50%;
        width: 60px;
        height: 60px;
        margin: 10px;
    }
    .uploader-submit button.upload-trash{
        background-color: red;
        width: 50px;
        height: 50px;
    }
    label {
        width: 200px;
        text-transform: uppercase;
        text-align: center;
        margin-top: 10px;
        cursor: pointer;
        font-weight:bold
    }
</style>