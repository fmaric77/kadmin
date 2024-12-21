<template>
    <q-page class="q-pa-md">
      <q-card>
        <q-card-section>
          <div class="text-h6">Proizvodi na narudžbi</div>
        </q-card-section>
        <q-card-section>
          <CategoryDropdown @categoryChanged="handleCategoryChange" />
          <q-input filled v-model="searchTerm" label="Pretraži" class="q-mb-md" />
          <q-btn @click="showAddProductOnOrderDialog" label="Dodaj Proizvod na Narudžbu" color="primary" class="q-mb-md" />
          <q-table :rows="filteredProductsOnOrder" :columns="columns" row-key="id">
            <template v-slot:body-cell-actions="props">
              <q-td :props="props" align="center">
                <q-btn flat round icon="delete" color="red" @click="deleteProductOnOrder(props.row.Sifra_narudzbe, props.row.Sifra_proizvoda)" />
              </q-td>
            </template>
          </q-table>
        </q-card-section>
      </q-card>
  
      <q-dialog v-model="isDialogOpen">
        <q-card>
          <q-card-section>
            <div class="text-h6">{{ isEditing ? 'Uredi Proizvod na Narudžbu' : 'Dodaj Proizvod na Narudžbu' }}</div>
          </q-card-section>
          <q-card-section>
            <q-form @submit.prevent="isEditing ? updateProductOnOrder() : addProductOnOrder()">
              <q-select
                filled
                v-model="form.Sifra_narudzbe"
                :options="orders"
                label="Šifra narudžbe"
                required
                emit-value
                map-options
              />
              <q-select
                filled
                v-model="form.Sifra_proizvoda"
                :options="products"
                label="Šifra proizvoda"
                required
                emit-value
                map-options
              />
              <q-input
                filled
                v-model.number="form.Kolicina_narucenog_proizvoda"
                label="Količina"
                type="number"
                required
              />
              <q-btn type="submit" label="Spremi" color="primary" class="q-mt-md" />
              <q-btn type="button" label="Odustani" color="warning" class="q-mt-md" @click="closeDialog" />
            </q-form>
          </q-card-section>
        </q-card>
      </q-dialog>
    </q-page>
  </template>
  
  <script setup>
  import { ref, onMounted, computed } from 'vue';
  import axios from 'axios';
  import CategoryDropdown from 'src/components/CategoryDropdown.vue';
  
  const baseURL = window.location.hostname === 'localhost' 
    ? 'http://localhost:3000/api' 
    : 'https://kadmin-7i923vaxr-goldenarchangels-projects.vercel.app/api';
  
  const productsOnOrder = ref([]);
  const orders = ref([]);
  const products = ref([]);
  const searchTerm = ref('');
  const isDialogOpen = ref(false);
  const isEditing = ref(false);
  const form = ref({
    Sifra_narudzbe: null,
    Sifra_proizvoda: null,
    Kolicina_narucenog_proizvoda: null,
  });
  
  const columns = [
    { name: 'Sifra_narudzbe', label: 'Šifra narudžbe', field: 'Sifra_narudzbe', align: 'left' },
    { name: 'Sifra_proizvoda', label: 'Šifra proizvoda', field: 'Sifra_proizvoda', align: 'left' },
    { name: 'Kolicina_narucenog_proizvoda', label: 'Količina', field: 'Kolicina_narucenog_proizvoda', align: 'left' },
    { name: 'actions', label: 'Akcije', align: 'center', sortable: false },
  ];
  
  const fetchProductsOnOrder = async () => {
    try {
      const response = await axios.get(`${baseURL}/productsOnOrder`);
      productsOnOrder.value = response.data;
    } catch (error) {
      console.error('Error fetching products on order:', error);
    }
  };
  
  const fetchOrders = async () => {
    try {
      const response = await axios.get(`${baseURL}/orders`);
      orders.value = response.data.map(order => ({
        label: order.Sifra_narudzbe,
        value: order.Sifra_narudzbe,
      }));
    } catch (error) {
      console.error('Error fetching orders:', error);
    }
  };
  
  const fetchProducts = async () => {
    try {
      const response = await axios.get(`${baseURL}/products`);
      products.value = response.data.map(product => ({
        label: product.Naziv,
        value: product.Sifra_proizvoda,
      }));
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };
  
  const filteredProductsOnOrder = computed(() => {
    if (!searchTerm.value) return productsOnOrder.value;
    const term = searchTerm.value.toLowerCase();
    return productsOnOrder.value.filter(item => {
      return (
        (item.Sifra_narudzbe || '').toString().includes(term) ||
        (item.Sifra_proizvoda || '').toString().includes(term) ||
        (item.Kolicina_narucenog_proizvoda || '').toString().includes(term)
      );
    });
  });
  
  const showAddProductOnOrderDialog = () => {
    isEditing.value = false;
    form.value = {
      Sifra_narudzbe: null,
      Sifra_proizvoda: null,
      Kolicina_narucenog_proizvoda: null,
    };
    isDialogOpen.value = true;
  };
  
  const validateForm = () => {
    return (
      form.value.Sifra_narudzbe !== null &&
      form.value.Sifra_proizvoda !== null &&
      form.value.Kolicina_narucenog_proizvoda !== null
    );
  };
  
  const addProductOnOrder = async () => {
    if (!validateForm()) {
      alert('Sva polja moraju biti popunjena.');
      return;
    }
    try {
      await axios.post(`${baseURL}/productsOnOrder`, form.value);
      fetchProductsOnOrder();
      closeDialog();
    } catch (error) {
      console.error('Error adding product on order:', error);
      alert('Došlo je do greške prilikom dodavanja proizvoda na narudžbu.');
    }
  };
  
  const updateProductOnOrder = async () => {
    if (!validateForm()) {
      alert('Sva polja moraju biti popunjena.');
      return;
    }
    try {
      await axios.put(`${baseURL}/productsOnOrder/${form.value.Sifra_narudzbe}/${form.value.Sifra_proizvoda}`, form.value);
      fetchProductsOnOrder();
      closeDialog();
    } catch (error) {
      console.error('Error updating product on order:', error);
      alert('Došlo je do greške prilikom ažuriranja proizvoda na narudžbu.');
    }
  };
  
  const deleteProductOnOrder = async (orderId, productId) => {
    if (!confirm('Jeste li sigurni da želite izbrisati ovaj proizvod na narudžbi?')) return;
    try {
      await axios.delete(`${baseURL}/productsOnOrder/${orderId}/${productId}`);
      fetchProductsOnOrder();
    } catch (error) {
      console.error('Error deleting product on order:', error);
      alert('Došlo je do greške prilikom brisanja proizvoda na narudžbi.');
    }
  };
  
  const closeDialog = () => {
    isDialogOpen.value = false;
  };
  
  const handleCategoryChange = (category) => {
    console.log('Odabrana kategorija:', category);
  };
  
  onMounted(() => {
    fetchProductsOnOrder();
    fetchOrders();
    fetchProducts();
  });
  </script>
  
  <style scoped>
  /* Add any scoped styles here */
  </style>