<template>
  <div class="container py-5">
    <div class="row justify-content-center">
      <div class="col-md-6 col-lg-5">
        <div class="card shadow rounded-4 p-4">
          <div class="card-body">
            <h2 class="text-center mb-4" style="color: #ff6b35;">Iniciar Sesión</h2>
            <form @submit.prevent="handleLogin">
              <div class="mb-3">
                <label for="name" class="form-label">Usuario</label>
                <input type="text" class="form-control" id="name" v-model="name" required
                  style="border: 2px solid #ff6b35;">
              </div>
              <div class="mb-4">
                <label for="password" class="form-label">Contraseña</label>
                <input type="password" class="form-control" id="password" v-model="password" required
                  style="border: 2px solid #ff6b35;">
              </div>
              <div class="d-grid">
                <button type="submit" class="btn text-white fw-semibold py-2" style="background-color: #ff6b35;">
                  Iniciar Sesión
                </button>
              </div>
            </form>

            <div class="position-absolute" style="top: 10px; left: 8px;">
              <button @click="goBack" class="btn text-orange-500 fw-semibold py-1 px-2"
                style="border: none; text-decoration: underline; color: #ff6b35;">
                Regresar
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import Swal from 'sweetalert2';

export default {
  name: 'LoginPage',
  data() {
    return {
      name: '',
      password: ''
    };
  },
  methods: {
    async handleLogin() {
      try {
        const response = await axios.post('https://back-test-6b3e.onrender.com/api/login', {
          name: this.name,
          password: this.password
        });

        const { token } = response.data;
        localStorage.setItem('token', token);
        Swal.fire({
          icon: 'success',
          title: 'Inicio de sesión exitoso',
          text: 'Bienvenido!',
          timer: 2000,
          showConfirmButton: true, 
          confirmButtonText: 'De acuerdo',  
          confirmButtonColor: '#28a745',  
          showCancelButton: false, 
          customClass: {
            confirmButton: 'btn-success'  
          }
        }).then(() => {
          this.$router.go(-1);
        });

      } catch (error) {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Usuario o contraseña incorrectos',
          showConfirmButton: true,
          confirmButtonText: 'De acuerdo',  
          confirmButtonColor: '#d33', 
          customClass: {
            confirmButton: 'btn-error' 
          }
        });
      }
    },
    goBack() {
      this.$router.go(-1);
    }
  }
};
</script>
