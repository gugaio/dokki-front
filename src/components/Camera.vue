<template lang="">
    <div class="camera-root">     
        <form>
            <!-- <div class="camera-toggle-container">
                <button class="camera-toggle" @click.prevent="toggleCamera">
                    {{this.isCameraOpen?"Fechar Camera":"Abrir Camera"}}
                </button>
            </div> -->
            <div  class="camera-box" :class="{ 'flash' : isShotPhoto }"> 
                <div class="camera-loading" v-show="isCameraOpen && isLoading" >
                    <ul class="loader-circle">
                        <li></li>
                        <li></li>
                        <li></li>
                    </ul>
                </div>   
                <!-- <div class="camera-shutter" :class="{'flash' : isShotPhoto}"></div> -->
                <video  v-show="!this.isPhotoTaken" id="video" ref="camera" :width="this.videoWidth" :height="this.videoWidth/this.aspectRato" autoplay></video>                
                <canvas id="photoTaken" ref="canvas" :width="this.canvasWidth" :height="this.canvasHeight" class="canvas"></canvas>
                <img v-show="this.isPhotoTaken" id="imgPhoto" :width="this.videoWidth" :height="this.videoWidth/this.aspectRato"/>
            </div> 
               
            <div class="camera-shoot" >
                <button type="button" :class="!isCameraOpen || this.isLoading?'camera-shoot-to-open':'camera-shoot-to-take'" @click="takePhoto">
                    <span v-show="!isCameraOpen || this.isLoading">Abrir Camera</span>
                    <img v-show="isCameraOpen && !this.isLoading && !isPhotoTaken" src="/cameraNoBack.png" alt="Upload" />
                    <img v-show="isCameraOpen && !this.isLoading && isPhotoTaken" src="/reload-removebg -small.png" alt="Reload" />
                </button>
            </div>
            <div class="submits" v-show="this.isPhotoTaken">
                <button class="camera-toggle" @click.prevent="uploadImage">
                    Enviar Foto
                </button>
            </div>
        </form>
  </div>
</template>
<script>
import documentService from '@/services/documentService.js';

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
            aspectRato: 1.77,
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
                        height: { ideal: 900 }
                        }
                    });
            navigator.mediaDevices
                        .getUserMedia(constraints)
                        .then(stream => {
                this.isLoading = false;

                let settings = stream.getVideoTracks()[0] 
                    .getSettings(); 

                this.aspectRato = settings.aspectRatio; 
  
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
            if(!this.isCameraOpen){
                this.toggleCamera();
                return;
            }
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
            let blob = document.getElementById("photoTaken").toBlob((blob) => {
                documentService.uploadBlob(blob)
                .then(data => {

                    this.$router.push({ name: 'doc', params: { id: data.uuid } , query: { extension: data.extension }})
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
    .submits button{
        margin: 30px auto;
     }
    .camera-box {
        padding: 10px 0;
        background-color: black;
        filter: drop-shadow(-4px 4px 4px rgba(0, 0, 0, 0.75));
    }
    video {
        border-radius: 10px;
        background-color: black;
    }
    .canvas{
        display: none;
    }
    .camera-shoot-to-open {
        border-radius: 10px;
        width: 120px;
        height: 60px;
        filter: drop-shadow(-4px 4px 4px rgba(0, 0, 0, 0.75));
        display: block;
        margin-left: auto;
        margin-right: auto;
    }
    .camera-shoot-to-take {
        border-radius: 50%;
        width: 60px;
        height: 60px;
        filter: drop-shadow(-4px 4px 4px rgba(0, 0, 0, 0.75));
        display: block;
        margin-left: auto;
        margin-right: auto;
    }
    .camera-shoot-to-reload {
        border-radius: 50%;
        width: 60px;
        height: 60px;
        filter: drop-shadow(-4px 4px 4px rgba(0, 0, 0, 0.75));
        display: block;
        margin-left: auto;
        margin-right: auto;
        background-color: red;
        color: white;
    }
    h3{
        text-align: center;
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
        display: flex;
        align-items: center;
        justify-content: center;
        border: none;
        background-color: green;
        color: white;
        border-radius: 15px;
        width: 150px;
        height: 60px;
        filter: drop-shadow(-4px 4px 4px rgba(0, 0, 0, 0.75));
        cursor: pointer;
        font-weight:bold;
        text-align: center;
        text-transform: uppercase;
    }
    .camera-again{
        background-color: red;
        color: white;
    }
    .camera-loading {
        width: 100%;
        min-height: 20px;
        margin: 20px auto;
        position: fixed;
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