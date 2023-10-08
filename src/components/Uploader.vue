<template lang="">
    <div class="uploader-root">     
        <form>
            <div class="photo">
                <button class="circle-button">
                    <img src="/camera2.png" alt="Foto" />
                </button>
            </div>
            <h3>ou</h3>
            <div class="image-label-container">
                <img src="/upload.jpg" alt="Upload" />
                <label for="file">Selecionar nota</label>
                <input id="file" type="file" @change="onFileChange" />
            </div>
        </form>
        <div class="preview" v-if="fileData">
            <img :src="fileData" alt="Preview" />
        </div>
        <button @click="uploadPhoto" v-if="fileData" >Up</button>
  </div>
</template>
<script>
import axios from 'axios';

export default {

    data() {
        return {
            fileData: null,
        }
    },
    methods: {
        onFileChange(event) {
            this.fileData = event.target.files[0];
        },
        uploadPhoto() {
            if (!this.fileData) return;

            // Replace 'UPLOAD_URL' with your actual backend API endpoint to handle photo upload
            const uploadUrl = 'http://localhost:3000/upload?agent=dokki&sender=guga';
            let formData = new FormData();
            formData.append('file', this.fileData);

            axios
                .post(uploadUrl,
                    formData,
                    {
                        headers: {
                            'Content-Type': 'multipart/form-data',
                        },
                    })
                .then((response) => {
                    console.log(response.data);
                    this.fileData = null;
                })
                .catch((error) => {
                    alert(error);
                    console.error(error);
                });
        },
        
    },
    
}
</script>
<style>
    .uploader-root {
        margin-left: auto;
        margin-right: auto;
        margin-top: 200px;
    }
    .photo {
        margin-left: auto;
        margin-right: auto;
        width: 50px;
    }
    h3{
        text-align: center;
        color: white;
        margin: 20px;
    }
    input[type="file"] {
        display: none;
    }
    .image-label-container {
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
    label {
        width: 200px;
        text-transform: uppercase;
        text-align: center;
        margin-top: 10px;
        cursor: pointer;
        font-weight:bold
    }
    .circle-button {
        display: flex;
        align-items: center;
        justify-content: center;
        border: none;
        background-color: white;
        border-radius: 50%;
        width: 60px;
        height: 60px;
        filter: drop-shadow(-4px 4px 4px rgba(0, 0, 0, 0.75));
        cursor: pointer;
    }
    img {
        width: 36px;
        height: 30px;
        display: block;
    }
</style>