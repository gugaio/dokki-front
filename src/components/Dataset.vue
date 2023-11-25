<template>
  <h2 class="dataset-header">Nossa base pública de notas fiscais</h2>
  <div class="card-container">
    <router-link :to="{ name: 'upload'}">
        <div class="card">
          <div class="card-new-dataset">
            +
          </div>
        </div>
        <h3>Adicionar</h3> 
    </router-link>   
    <div v-for="item in items" :key="item.id" >       
      <router-link v-if="item.id!==undefined" :to="{ name: 'doc', params: { id: item.id } }">
        <div class="card">
          <img  :src="cardImage(item.id)" :style='{ maxWidth: "200px", maxHeight:  "200px"}' alt="">
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
        if(item==='') return;
        return `http://localhost:3000/download/${item}`;
      }
    }
  }
  </script>

  <style>
  .dataset-header{
    text-align: center;
    margin: 20px;
  }
  .card-container {
    display: flex;
    flex-wrap: wrap;
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

  .card-new-dataset {
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 50px;
    font-weight: bold;
    color: hsla(160, 100%, 37%, 1);
    height: 100%;
    border: 1px dashed hsla(160, 100%, 37%, 1);
    border-radius: 10px;
  }
  
  </style>