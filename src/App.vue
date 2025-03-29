<template>
  <div class="d-flex flex-column min-vh-100">
    <header class="bg-white shadow-sm sticky-top">
      <div class="container">
        <div class="d-flex justify-content-between align-items-center py-3 flex-column flex-sm-row">
          <div class="d-flex align-items-center w-100 justify-content-between">
            <h1 v-if="$route.path === '/login' || $route.path === '/detalle'" class="fs-4 fw-bold mb-0"
              style="color: #ff6b35;">Fizz Burger</h1>
            <div v-if="$route.path !== '/login' && $route.path !== '/detalle'"
              class="d-flex align-items-center w-100 justify-content-between">
              <h1 class="fs-4 fw-bold mb-0" style="color: #ff6b35;">Fizz Burger</h1>

              <button v-if="isAuthenticated"
                class="btn fw-medium border-0 px-3 py-2 rounded-2 text-white ms-auto d-block d-sm-none"
                @click="openCreateProductModal" style="background-color: #ff6b35; white-space: nowrap;">
                Crear Producto
              </button>
              <router-link to="/login" class="btn fw-medium border-0 px-3 py-2 rounded-2 text-white d-sm-none"
                style="background-color: #ff6b35; white-space: nowrap;">
                Iniciar Sesión
              </router-link>
            </div>
          </div>

          <nav class="d-flex align-items-center gap-2 w-10 mt-2 mt-sm-0">
            <button v-if="isAuthenticated"
              class="btn fw-medium border-0 px-3 py-2 rounded-2 text-white d-none d-sm-inline-block"
              @click="openCreateProductModal" style="background-color: #ff6b35; white-space: nowrap;">
              Crear Producto
            </button>

            <router-link to="/login"
              class="btn fw-medium border-0 px-3 py-2 rounded-2 text-white d-none d-sm-inline-block"
              style="background-color: #ff6b35; white-space: nowrap;">
              Iniciar Sesión
            </router-link>
          </nav>
        </div>
      </div>
    </header>

    <router-view :key="componentKey"></router-view>

    <ModalCreaProducto :showModal="showModal" :newProduct="newProduct" @close-modal="closeCreateProductModal" />

    <footer class="mt-auto py-4 text-center" style="background-color: #333; color: white;">
      <div class="container">
        <p class="mb-0" style="color: #999; font-size: 0.9rem;">&copy; 2023 Fizz Burger. Todos los derechos reservados.
        </p>
      </div>
    </footer>
  </div>
</template>

<script>
import ModalCreaProducto from './components/ModalCreaProducto.vue';
import axios from 'axios';

export default {
  components: {
    ModalCreaProducto,
  },
  data() {
    return {
      showModal: false,
      newProduct: {
        name: '',
        type: 'hamburguesa',
        price: 0,
        image: '',
        isPromotion: false,
        discount: 0,
        ingredients: '',
        status: true,
      },
      componentKey: 0,
      isAuthenticated: false,
    };
  },
  mounted() {
    this.verifyToken();
  },
  methods: {
    openCreateProductModal() {
      this.showModal = true;
    },
    closeCreateProductModal() {
      this.showModal = false;
    },
    verifyToken() {
      const token = localStorage.getItem('token');  

      if (token) {
        axios
          .post('https://back-test-6b3e.onrender.com/api/verify-token', {}, {
            headers: {
              Authorization: `Bearer ${token}`, 
            },
          })
          .then(() => {
            this.isAuthenticated = true;  
          })
          .catch(() => {
            this.isAuthenticated = false;  
          });
      } else {
        this.isAuthenticated = false; 
      }
    }
  },
};
</script>
