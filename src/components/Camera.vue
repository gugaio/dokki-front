<template lang="">
    <div class="camera-root">     
        <form>
            <div class="camera-toggle-container">
                <button class="camera-toggle" @click.prevent="toggleCamera">
                    {{this.isCameraOpen?"Fechar Camera":"Abrir Camera"}}
                </button>
            </div>
            <div class="camera-loading" v-show="isCameraOpen && isLoading" >
                <ul class="loader-circle">
                    <li></li>
                    <li></li>
                    <li></li>
                </ul>
            </div>
            <div class="camera-box" v-if="isCameraOpen" v-show="!isLoading"  :class="{ 'flash' : isShotPhoto }"> 
                <div class="camera-shutter" :class="{'flash' : isShotPhoto}"></div>
                <video v-show="!isPhotoTaken"  id="video" ref="camera" :width="this.videoWidth" :height="this.videoHeight" autoplay></video>                
                <canvas id="photoTaken" ref="canvas" :width="this.canvasWidth" :height="this.canvasHeight" class="canvas"></canvas>
                <img id="imgPhoto" :width="this.videoWidth" :height="this.videoHeight"/>
            </div>            
            <div class="camera-shoot" v-if="isCameraOpen && !isLoading" >
                <button type="button" class="button" @click="takePhoto">
                </button>
            </div>
            <div class="submits" v-show="this.isPhotoTaken">
                <button class="camera-toggle" @click.prevent="uploadImage">
                    Enviar
                </button>
                <button class="camera-toggle camera-again" @click.prevent="cleanPhoto">
                    Outra foto
                </button>
            </div>
        </form>
  </div>
</template>
<script>
import uploaderService from '@/services/uploaderService.js';

export default {

    data() {
        return {
            fileData: null,
            isCameraOpen: false,
            isPhotoTaken: false,
            isShotPhoto: false,
            isLoading: false,
            streaming:false,
            link: '#',
            videoWidth:  window.innerWidth <= 800? window.innerWidth: 800,
            videoHeight:  window.innerWidth <= 800? window.innerWidth * 0.75: 800 * 0.75,
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
                        video: {
                            width: { ideal: 1800 }, 
                        height: { ideal: 900 } 
                        }
                    });
            navigator.mediaDevices
                        .getUserMedia(constraints)
                        .then(stream => {
                this.isLoading = false;

                let settings = stream.getVideoTracks()[0] 
                    .getSettings(); 
  
                let width = settings.width; 
                let height = settings.height; 

                this.canvasWidth = width;
                this.canvasHeight = height;
  
                console.log('Actual width of the camera video: ' 
                    + width + 'px'); 
                console.log('Actual height of the camera video:' 
                    + height + 'px'); 

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
            context.drawImage(this.$refs.camera, 0, 0, this.canvasWidth, this.canvasHeight);

            let dataUrl = this.$refs.canvas.toDataURL()
            let imgPhoto = document.getElementById('imgPhoto');
            imgPhoto.src = dataUrl;
        },
        cleanPhoto() {           
            this.isPhotoTaken = false;            
        },
        uploadImage() {
            let blob = document.getElementById("photoTaken").toBlob(function(blob) {
                uploaderService.uploadBlob(blob)
                .then(response => {
                    this.$router.push({ name: 'Document', params: { id: response.data } })
                })
                .catch(e => {
                    console.log(e);
                });
			}, 'image/jpeg');
        },
        
    },
    
}
</script>
<style>
    .camera-root {
        margin-left: auto;
        margin-right: auto;
        margin-top: 100px;
    }
    .camera-toggle-container {
        margin-left: auto;
        margin-right: auto;
        width: 120px;
    }
    .submits{
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: center;
        gap: 20px;
    }
    .camera-box {
        position: absolute;
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
        filter: drop-shadow(-4px 4px 4px rgba(0, 0, 0, 0.75));
    }
    video {
        border-radius: 10px;
    }
    .canvas{
        display: none;
    }
    .camera-shoot button {
        border-radius: 50%;
        width: 50px;
        height: 50px;
        filter: drop-shadow(-4px 4px 4px rgba(0, 0, 0, 0.75));
        display: block;
        margin-left: auto;
        margin-right: auto;
        margin-top: -50px;
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
    .camera-toggle {
        margin-bottom: 2rem;
        width: 300px;
        padding:15px;
        text-transform: uppercase;
        text-align: center;
        margin-top: 10px;
        cursor: pointer;
        font-weight:bold;
        color: black;
    }
    .camera-toggle {
        display: flex;
        align-items: center;
        justify-content: center;
        border: none;
        background-color: white;
        border-radius: 15px;
        width: 120px;
        height: 60px;
        filter: drop-shadow(-4px 4px 4px rgba(0, 0, 0, 0.75));
        cursor: pointer;
    }
    .camera-again{
        background-color: red;
        color: white;
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