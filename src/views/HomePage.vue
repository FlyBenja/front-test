<template>
  <div>
    <section class="py-5 text-center text-white" style="background-color: #ff6b35;">
      <div class="container">
        <h2 class="display-5 fw-bold">Delicioso, fresco y asequible</h2>
      </div>
    </section>

    <section class="py-5">
      <div class="container">
        <h2 class="text-center fs-1 mb-5">Nuestro Menú</h2>

        <div class="d-flex justify-content-center gap-4 mb-4">

          <div>
            <label for="priceFrom" class="form-label fs-5 fw-medium">Precio Desde</label>
            <input type="number" id="priceFrom" v-model="priceFrom"
              class="form-control shadow-sm border border-dark rounded-pill py-2 px-3" @change="fetchMenuItems" />
          </div>

          <div>
            <label for="priceTo" class="form-label fs-5 fw-medium">Precio Hasta</label>
            <input type="number" id="priceTo" v-model="priceTo"
              class="form-control shadow-sm border border-dark rounded-pill py-2 px-3" @change="fetchMenuItems" />
          </div>

          <div>
            <label for="orderBy" class="form-label fs-5 fw-medium">Ordenar Por</label>
            <select id="orderBy" v-model="orderBy"
              class="form-select shadow-sm border border-dark rounded-pill py-2 px-3" @change="fetchMenuItems">
              <option value="price">Precio</option>
              <option value="name">Nombre</option>
            </select>
          </div>

          <div>
            <label for="orderDirection" class="form-label fs-5 fw-medium">Dirección</label>
            <select id="orderDirection" v-model="orderDirection"
              class="form-select shadow-sm border border-dark rounded-pill py-2 px-3" @change="fetchMenuItems">
              <option value="asc">Ascendente</option>
              <option value="desc">Descendente</option>
            </select>
          </div>
        </div>

        <div class="d-flex justify-content-center gap-4 mb-4">
          <div>
            <label for="onlyPromotions" class="form-label fs-5 fw-medium">Solo Promociones</label>
            <div class="form-check form-switch">
              <input type="checkbox" class="form-check-input" id="onlyPromotions" v-model="onlyPromotions"
                @change="fetchMenuItems" />
              <label class="form-check-label" for="onlyPromotions"></label>
            </div>
          </div>

          <div>
            <label for="searchName" class="form-label fs-5 fw-medium">Buscar por Nombre</label>
            <input type="text" id="searchName" v-model="searchName"
              class="form-control shadow-sm border border-dark rounded-pill py-2 px-3" @input="fetchMenuItems" />
          </div>
        </div>

        <div class="d-flex justify-content-center flex-wrap gap-2 mb-4">
          <button v-for="category in categories" :key="category" @click="changeCategory(category)"
            class="btn border-0 fw-medium px-4 py-2 rounded-pill"
            :class="activeCategory === category ? 'text-white' : ''" :style="{
              backgroundColor: activeCategory === category ? '#ff6b35' : '#f0f0f0',
              color: activeCategory === category ? 'white' : 'inherit'
            }">
            {{ categoryTranslations[category] }}
          </button>
        </div>

        <div class="row row-cols-1 row-cols-md-2 row-cols-lg-4 g-4">
          <div v-for="item in displayedItems" :key="item._id" class="col">
            <div class="card h-100 rounded-4 shadow-sm overflow-hidden" style="transition: transform 0.3s ease"
              @mouseenter="$event.currentTarget.style.transform = 'translateY(-5px)'"
              @mouseleave="$event.currentTarget.style.transform = 'translateY(0)'">
              <div class="position-relative">
                <img :src="item.image" :alt="item.name" class="card-img-top"
                  style="height: 180px; object-fit: cover;" />

                <div v-if="item.isPromotion" class="position-absolute top-0 end-0 m-2 badge rounded-pill fw-semibold"
                  style="background-color: #e74c3c; font-size: 0.8rem; padding: 5px 10px;">
                  Promoción
                </div>
              </div>
              <div class="card-body p-4">
                <h3 class="card-title fs-5 mb-0">{{ item.name }}</h3>
                <p class="card-text text-secondary small mb-2" style="height: 5px;">{{ item.description }}</p>

                <div v-if="item.isPromotion" class="d-flex justify-content-between align-items-center mb-3">
                  <span class="fw-bold fs-5 text-decoration-line-through text-muted">${{ item.price.toFixed(2) }}</span>
                  <span class="fw-bold fs-5 text-danger">${{ (item.price * (1 - item.discount / 100)).toFixed(2)
                  }}</span>
                </div>
                <div v-else class="d-flex justify-content-between align-items-center mb-3">
                  <span class="fw-bold fs-5">${{ item.price.toFixed(2) }}</span>
                </div>

                <div class="d-flex justify-content-between align-items-center">
                  <button @click="goToDetailsPage(item._id)"
                    class="btn text-white fw-semibold px-3 py-2 rounded-2 w-100"
                    style="background-color: #ff6b35;">Detalle</button>
                </div>

                <p v-if="item.status" class="text-success mt-3">Estado: Disponible</p>
                <p v-else class="text-danger mt-3">Estado: No disponible</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'HomePage',
  data() {
    return {
      activeCategory: 'burger', 
      categories: ['burger', 'condiments', 'snacks', 'drinks'],
      menuItems: [],  
      priceFrom: null,  
      priceTo: null,    
      orderBy: 'price', 
      orderDirection: 'desc', 
      onlyPromotions: false, 
      searchName: '', 
      categoryTranslations: { 
        burger: 'Hamburguesas',
        condiments: 'Condimentos',
        snacks: 'Aperitivos',
        drinks: 'Bebidas'
      }
    };
  },
  mounted() {
    this.fetchMenuItems(); 
  },
  beforeMount() {
    if (!this.isSearchActive && !sessionStorage.getItem('reloaded')) {
      sessionStorage.setItem('reloaded', 'true');
      window.location.reload();
    } else {
      sessionStorage.removeItem('reloaded');
    }
  },
  computed: {

    displayedItems() {
      let filteredItems = this.menuItems.filter(item => item.type === this.activeCategory);

      if (this.onlyPromotions) {
        filteredItems = filteredItems.filter(item => item.isPromotion);
      }

      if (this.searchName) {
        filteredItems = filteredItems.filter(item =>
          item.name.toLowerCase().includes(this.searchName.toLowerCase())
        );
      }

      return filteredItems;
    }
  },
  methods: {
    async fetchMenuItems() {
      try {
        let url = `https://back-test-6b3e.onrender.com/api/product?`;

        if (this.priceFrom) url += `priceFrom=${this.priceFrom}&`;
        if (this.priceTo) url += `priceTo=${this.priceTo}&`;
        if (this.orderBy) url += `orderBy=${this.orderBy}&`;
        if (this.orderDirection) url += `orderDirection=${this.orderDirection}&`;
        if (this.onlyPromotions) url += `onlyPromotions=true&`; 
        if (this.searchName) url += `searchName=${this.searchName}&`; 

        url = url.slice(0, -1);

        const response = await axios.get(url);
        this.menuItems = response.data;
      } catch (error) {
        console.error('Error al obtener los productos:', error);
      }
    },
    goToDetailsPage(productId) {
      localStorage.removeItem('productId');
      localStorage.setItem('productId', productId);
      this.$router.push({ name: 'DetallePage' });
    },
    changeCategory(categoryId) {
      this.activeCategory = categoryId;
      this.fetchMenuItems(); 
    }
  }
};
</script>
