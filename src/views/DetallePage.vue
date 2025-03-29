<template>
  <div>
    <section class="py-5 text-center text-white" style="background-color: #ff6b35;">
      <div class="container">
        <h2 class="display-5 fw-bold">Detalle del Producto</h2>
      </div>
    </section>

    <section class="py-5">
      <div class="container">
        <div v-if="product" class="row">
          <div class="col-md-6">
            <img :src="product.image" :alt="product.name" class="img-fluid rounded-4 shadow-sm"
              style="object-fit: cover; height: 300px;" />
          </div>
          <div class="col-md-6">
            <div class="position-absolute" style="top: 5px; right: 15px;">
              <button @click="goBack"
                class="btn text-white fw-semibold py-2 px-4 rounded-lg shadow-md hover:bg-orange-600 transition duration-300 ease-in-out transform hover:scale-105"
                style="border: none; background-color: #ff6b35; color: #fff; font-size: 16px;">
                Regresar
              </button>
            </div>
            <h3 class="fs-2 mb-3">{{ product.name }}</h3>
            <div v-if="product.badge" class="badge rounded-pill fw-semibold"
              style="background-color: #ff6b35; font-size: 0.8rem; padding: 5px 10px;">
              {{ product.badge }}
            </div>
            <div v-if="product.isPromotion" class="badge rounded-pill fw-semibold"
              style="background-color: #e74c3c; font-size: 0.8rem; padding: 5px 10px;">
              Promoción
            </div>
            <p v-if="product.type" class="text-secondary">Tipo: {{ product.type }}</p>

            <p v-if="product.ingredients.length > 0" class="text-secondary">Ingredientes:</p>
            <ul v-if="product.ingredients.length > 0">
              <li v-for="ingredient in product.ingredients" :key="ingredient">{{ ingredient }}</li>
            </ul>

            <p v-if="product.status" class="text-success">Estado: Disponible</p>
            <p v-else class="text-danger">Estado: No disponible</p>
            <p v-if="product.discount > 0" class="text-danger">
              ¡Descuento! de {{ (product.discount).toFixed(0) }}% en el producto
            </p>

            <div class="d-flex justify-content-between mt-4" v-if="isAuthenticated">
              <button @click="editProduct" class="btn btn-warning text-white fw-semibold py-2 px-4 rounded-2">
                Editar Producto
              </button>
              <button @click="confirmDeleteProduct" class="btn btn-danger text-white fw-semibold py-2 px-4 rounded-2">
                Eliminar Producto
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>

    <ModalEditaProducto :showModal="showModal" :productToEdit="product" @close-modal="showModal = false" />
  </div>
</template>

<script>
import axios from 'axios';
import Swal from 'sweetalert2';
import ModalEditaProducto from '../components/ModalEditaProducto.vue';

export default {
  name: 'DetallePage',
  components: {
    ModalEditaProducto, 
  },
  data() {
    return {
      product: null,
      showModal: false, 
      isAuthenticated: false, 
    };
  },
  mounted() {
    this.verifyToken();  
    this.fetchProductDetails();
  },
  methods: {
    async fetchProductDetails() {
      const productId = localStorage.getItem('productId');
      if (!productId) {
        this.$router.push({ name: 'HomePage' });
        return;
      }
      try {
        const response = await axios.get(`https://back-test-6b3e.onrender.com/api/product/${productId}`);
        this.product = response.data;
      } catch (error) {
        console.error('Error al obtener el producto:', error);
      }
    },
    goBack() {
      this.$router.go(-1);
    },
    editProduct() {
      this.showModal = true;
    },
    confirmDeleteProduct() {
      Swal.fire({
        title: '¿Estás seguro?',
        text: "Este producto será eliminado permanentemente.",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Eliminar',
        cancelButtonText: 'Cancelar',
        confirmButtonColor: '#e74c3c',
        cancelButtonColor: '#ff6b35',
      }).then(async (result) => {
        if (result.isConfirmed) {
          try {
            await this.deleteProduct();
            Swal.fire({
              icon: 'success',
              title: 'Producto eliminado',
              text: 'El producto ha sido eliminado exitosamente.',
              showConfirmButton: true,
              confirmButtonText: 'De acuerdo',
              confirmButtonColor: '#28a745',
            }).then(() => {
              this.$router.go(-1);
            });
          } catch (error) {
            Swal.fire({
              icon: 'error',
              title: 'Error',
              text: 'Hubo un error al eliminar el producto.',
              showConfirmButton: true,
              confirmButtonText: 'De acuerdo',
              confirmButtonColor: '#d33',
            });
          }
        }
      });
    },
    async deleteProduct() {
      const productId = localStorage.getItem('productId');
      await axios.delete(`https://back-test-6b3e.onrender.com/api/product/${productId}`);
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
  }
};
</script>
