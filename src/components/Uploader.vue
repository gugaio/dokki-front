<template lang="">
    <div>
        <h1>Photo Upload App</h1>
        <input type="file" @change="onFileChange" />
        <div class="preview" v-if="fileData">
            <img :src="fileData" alt="Preview" />
        </div>
        <button @click="uploadPhoto" v-if="fileData">Upload Photo</button>
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
<style lang="">
    
</style>