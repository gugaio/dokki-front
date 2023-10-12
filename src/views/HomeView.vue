<script setup>
</script>

<template>
  <main>
    <div class="home-container">  
      <router-link to="camera" tag="div" class="home-container-link">
          <img src="/cameraNoBack.png" alt="Upload" />
          <span>Usar camera</span>
      </router-link>
      <h3>ou</h3>
      <router-link to="upload" tag="div" class="home-container-link">
          <img src="/upload-removebg.png" alt="Upload" />
          <span>Selecionar nota</span>
      </router-link>
    </div>
  </main>
</template>

<style>
     .home-container {
        margin-left: auto;
        margin-right: auto;
        margin-top: 200px;
    }
    .home-container h3{
        text-align: center;
        color: white;
        margin: 20px;
    }
    .home-container-link {
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
    a.home-container-link:hover {
      background-color: #b3b3b3; /* Set the background color when the mouse is over the anchor */
    }
    .home-container-link span {
        width: 200px;
        text-transform: uppercase;
        text-align: center;
        margin-top: 10px;
        cursor: pointer;
        font-weight:bold;
        color: black;
    }
    .home-container-link img {
        width: 36px;
        height: 30px;
        display: block;
    }
    </style>
