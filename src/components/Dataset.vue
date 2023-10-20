<template>
  <div class="card-container">
    <div v-for="item in items" :key="item" >
      <router-link :to="{ name: 'doc', params: { id: item.id } }">
        <div class="card">
          <img :src="cardImage(item.id)" :style='{ maxWidth: "200px", maxHeight:  "200px"}' alt="">
        </div>
        <h3>{{ item.originalName }}</h3> 
      </router-link>       
    </div>
  </div>
</template>

  <script>
  import datasetService from '@/services/datasetService';
  export default {
    data() {
      return {
        items: []
      }
    },
    async created() {
      this.items = await datasetService.getDataset()
    },
    methods: {
      cardImage(item) {
        return `http://localhost:3000/download/${item}`;
      }
    }
  }
  </script>

  <style>
  .card-container {
    display: flex;
  }

  .card {
    border: 1px solid #ccc;
    border-radius: 5px;
    margin-bottom: 10px;
    padding: 10px;
    width: 200px;
    height: 200px;
    margin: 10px;    
  }

  .card img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
  
  </style>