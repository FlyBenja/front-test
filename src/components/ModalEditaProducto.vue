<template>
    <div v-if="showModal" class="modal fade show" style="display: block;" tabindex="-1"
        aria-labelledby="editProductModal" aria-hidden="true">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="editProductModal">Editar Producto</h5>
                    <button type="button" class="btn-close" @click="closeEditProductModal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    <form @submit.prevent="submitProductForm">
                        <div class="row mb-3">
                            <div class="col-md-6">
                                <label for="productName" class="form-label">Nombre</label>
                                <input type="text" class="form-control" id="productName" v-model="product.name"
                                    placeholder="Ej: Hamburguesa Fizz" required>
                            </div>
                            <div class="col-md-6">
                                <label for="productType" class="form-label">Tipo</label>
                                <div class="input-group">
                                    <select class="form-control" id="productType" v-model="product.type" required>
                                        <option value="burger">Hamburguesa</option>
                                        <option value="condiments">Condimentos</option>
                                        <option value="snacks">Bocadillos</option>
                                        <option value="drinks">Bebidas</option>
                                    </select>
                                    <span class="input-group-text">
                                        <i class="bi bi-chevron-down"></i>
                                    </span>
                                </div>
                            </div>
                        </div>
                        <div class="row mb-3">
                            <div class="col-md-6">
                                <label for="productPrice" class="form-label">Precio</label>
                                <input type="number" class="form-control" id="productPrice" v-model="product.price"
                                    placeholder="Ej: 10.99" required step="0.01">
                            </div>
                            <div class="col-md-6">
                                <label for="productImage" class="form-label">Imagen (URL)</label>
                                <input type="text" class="form-control" id="productImage" v-model="product.image"
                                    placeholder="Ej: https://image.url" required>
                            </div>
                        </div>
                        <div class="row mb-3">
                            <div class="col-md-6">
                                <label class="form-label">En Promoción</label>
                                <select class="form-select" v-model="product.isPromotion">
                                    <option value="true">Sí hay promoción</option>
                                    <option value="false">No hay promoción</option>
                                </select>
                            </div>

                            <div class="col-md-6">
                                <label for="productDiscount" class="form-label">Descuento (%)</label>
                                <input type="number" class="form-control" id="productDiscount"
                                    v-model.number="product.discount" min="0" max="100" step="1" placeholder="Ej: 20">

                                <div v-if="product.discount < 0 || product.discount > 100" class="text-danger">
                                    El descuento debe estar entre 0 y 100.
                                </div>
                            </div>
                        </div>
                        <div class="row mb-3">
                            <div class="col-md-12">
                                <label for="productIngredients" class="form-label">Ingredientes (separados por
                                    coma)</label>
                                <input type="text" class="form-control w-100" id="productIngredients"
                                    v-model="product.ingredientsString" placeholder="Ej: Carne, Queso, Tomate" required>
                            </div>
                            <div class="col-md-6">
                                <label class="form-label">Estado</label>
                                <select class="form-select" v-model="product.status">
                                    <option value="active">A la venta</option>
                                    <option value="discontinued">Descontinuado</option>
                                </select>
                            </div>
                        </div>
                        <div v-if="submitError" class="alert alert-danger">
                            <strong>Error!</strong> Hubo un problema al editar el producto.
                        </div>
                        <div class="d-flex justify-content-between">
                            <button type="submit" class="btn btn-primary" style="background-color: #ff6b35;"
                                :disabled="isSubmitting">
                                <span v-if="isSubmitting" class="spinner-border spinner-border-sm" role="status"
                                    aria-hidden="true"></span>
                                {{ isSubmitting ? 'Guardando cambios...' : 'Guardar Cambios' }}
                            </button>
                            <button type="button" class="btn btn-secondary" @click="closeEditProductModal">
                                Cancelar
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import axios from 'axios';
import Swal from 'sweetalert2';
import eventBus from '../eventBus';

export default {
    props: ['showModal', 'productToEdit'],
    data() {
        return {
            isSubmitting: false,
            submitError: false,
            product: { ...this.productToEdit },
        };
    },
    watch: {

        productToEdit(newProduct) {
            this.product = { ...newProduct };
            this.product.ingredientsString = this.product.ingredients.join(', ');
            if (!this.product.promotion) {
                this.product.discount = 0;
            }
        }
    },
    methods: {
        closeEditProductModal() {
            this.$emit('close-modal');
        },
        async submitProductForm() {
            this.isSubmitting = true;
            this.submitError = false;
            this.product.ingredients = this.product.ingredientsString.split(',').map(ingredient => ingredient.trim());

            try {
                const productId = localStorage.getItem('productId');
                const response = await axios.put(`https://back-test-6b3e.onrender.com/api/product/${productId}`, this.product);
                console.log('Producto editado:', response.data);

                Swal.fire({
                    icon: 'success',
                    title: 'Producto editado',
                    text: 'El producto se ha editado correctamente.',
                    timer: 2000,
                    showConfirmButton: true,
                    confirmButtonText: 'De acuerdo',
                    confirmButtonColor: '#28a745',
                }).then((result) => {
                    if (result.isConfirmed) {
                        eventBus.$emit('product-edited');
                        this.closeEditProductModal();
                        this.$router.go(-1);
                    }
                });
                this.isSubmitting = false;
            } catch (error) {
                console.error('Error al editar producto:', error);
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'Hubo un problema al editar el producto.',
                    showConfirmButton: true,
                    confirmButtonText: 'De acuerdo',
                    confirmButtonColor: '#d33',
                });
                this.submitError = true;
                this.isSubmitting = false;
            }
        }
    },
};
</script>
