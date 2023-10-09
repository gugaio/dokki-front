<template lang="">
    <div class="uploader-root">     
        <form>
            <div class="camera-container">
                <button class="circle-button" @click.prevent="toggleCamera">
                    <img src="/camera2.png" alt="Foto" />
                </button>
            </div>
            <div class="camera-loading" v-show="isCameraOpen && isLoading" >
                <ul class="loader-circle">
                    <li></li>
                    <li></li>
                    <li></li>
                </ul>
            </div>
            <div v-if="isCameraOpen" v-show="!isLoading" class="camera-box" :class="{ 'flash' : isShotPhoto }">
    
                <div class="camera-shutter" :class="{'flash' : isShotPhoto}"></div>
                
                <video v-show="!isPhotoTaken" ref="camera" :width="450" :height="337.5" autoplay></video>a
                
                <canvas v-show="isPhotoTaken" id="photoTaken" ref="canvas" :width="450" :height="337.5"></canvas>
            </div>            
            <div v-if="isCameraOpen && !isLoading" class="camera-shoot">
                <button type="button" class="button" @click="takePhoto">
                <img src="https://img.icons8.com/material-outlined/50/000000/camera--v2.png">
                </button>
            </div>
            <div v-if="isPhotoTaken && isCameraOpen" class="camera-download">
                <a id="downloadPhoto" download="upload.jpg" class="button" role="button" @click="uploadImage">
                Download
                </a>
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
            isCameraOpen: false,
            isPhotoTaken: false,
            isShotPhoto: false,
            isLoading: false,
            link: '#'
        }
    },
    methods: {
        toggleCamera() {
            if(this.isCameraOpen) {
                this.isCameraOpen = false;
                this.isPhotoTaken = false;
                this.isShotPhoto = false;
                this.stopCameraStream();
            } else {
                this.isCameraOpen = true;
                this.createCameraElement();
            }
        },
        createCameraElement() {
            this.isLoading = true;            
            const constraints = (window.constraints = {
                        audio: false,
                        video: true
                    });
            navigator.mediaDevices
                        .getUserMedia(constraints)
                        .then(stream => {
                this.isLoading = false;
                            this.$refs.camera.srcObject = stream;
                        })
                        .catch(error => {
                this.isLoading = false;
                            alert("May the browser didn't support or there is some errors.");
                        });
        },            
        stopCameraStream() {
            let tracks = this.$refs.camera.srcObject.getTracks();
            tracks.forEach(track => {
                track.stop();
            });
        },
        takePhoto() {
            if(!this.isPhotoTaken) {
                this.isShotPhoto = true;
                const FLASH_TIMEOUT = 50;
                setTimeout(() => {
                    this.isShotPhoto = false;
                }, FLASH_TIMEOUT);
            }            
            this.isPhotoTaken = !this.isPhotoTaken;            
            const context = this.$refs.canvas.getContext('2d');
            context.drawImage(this.$refs.camera, 0, 0, 450, 337.5);
        },
        uploadImage() {
            debugger;

            let blob = document.getElementById("photoTaken").toBlob(function(blob) {
                console.log('Send blob to server or use it as you wish');
				let file = new File([blob], 'test.png', { type: 'image/jpeg' });

                let formData = new FormData();
                formData.append('file', file);

                axios.post('http://localhost:3000/upload?agent=dokki&sender=guga', formData, {
                        headers: {
                            'Content-Type': 'multipart/form-data',
                        },
                    })
                .then(response => {
                    console.log(response.data);
                })
                .catch(error => {
                    console.error(error);
                });

			}, 'image/jpeg');
        },
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
    .camera-container {
        margin-left: auto;
        margin-right: auto;
        width: 60px;
    }

    .camera-button {
        margin-bottom: 2rem;
    }

    .camera-box .camera-shutter { 
      opacity: 0;
      width: 450px;
      height: 337.5px;
      background-color: #fff;
      position: absolute;
    }

    .camera-box .camera-shutter .flash { 
        opacity: 1;
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

    .camera-loading {
        width: 100%;
        min-height: 20px;
        margin: 20px auto;
    }
    
    .camera-loading ul {
      z-index: 999999;
    }
    
    .camera-loading .loader-circle {
      height: 14px;
      width: 44px;
      margin: 0 auto;
      padding: 0;
    }
      
    .camera-loading  li {
        width: 10px;
        height: 10px;
        line-height: 10px;
        padding: 0;
        background: #999;
        animation: preload 1s infinite;
        border-radius: 100%;
        display: inline-block;
        margin: 0 2px;
    }

    .camera-loading  li:nth-child(2) {
          animation-delay: .2s;
    }

    .camera-loading  li:nth-child(3) {
          animation-delay: .4s;
    }

    @keyframes preload {
    0% {
      opacity: 1
    }
    50% {
      opacity: .4
    }
    100% {
      opacity: 1
    }
  }

</style>