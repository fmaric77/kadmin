<template>
    <q-page class="q-pa-md">
      <q-card>
        <q-card-section>
          <div class="text-h6">Proizvodi</div>
        </q-card-section>
        <q-card-section>
          <CategoryDropdown @categoryChanged="handleCategoryChange" />
          <q-input filled v-model="searchTerm" label="Pretraži" class="q-mb-md" />
          <q-btn @click="showAddProductDialog" label="Dodaj Proizvod" color="primary" class="q-mb-md" />
          <q-table
            :rows="filteredProducts"
            :columns="columns"
            row-key="Sifra_proizvoda"
          >
            <template v-slot:body-cell-Naziv="props">
              <q-td :props="props">
                <div v-if="!props.row.isEditingNaziv" @dblclick="enableEditing(props.row, 'naziv')" @touchstart="enableEditing(props.row, 'naziv')">
                  {{ props.row.Naziv }}
                </div>
                <q-input v-else v-model="props.row.Naziv" @blur="saveChanges(props.row, 'naziv')" />
              </q-td>
            </template>
            <template v-slot:body-cell-Marka="props">
              <q-td :props="props">
                <div v-if="!props.row.isEditingMarka" @dblclick="enableEditing(props.row, 'marka')" @touchstart="enableEditing(props.row, 'marka')">
                  {{ props.row.Marka }}
                </div>
                <q-input v-else v-model="props.row.Marka" @blur="saveChanges(props.row, 'marka')" />
              </q-td>
            </template>
            <template v-slot:body-cell-Cijena_proizvoda="props">
              <q-td :props="props">
                <div v-if="!props.row.isEditingCijena" @dblclick="enableEditing(props.row, 'cijena')" @touchstart="enableEditing(props.row, 'cijena')">
                  {{ props.row.Cijena_proizvoda }}
                </div>
                <q-input v-else type="number" v-model="props.row.Cijena_proizvoda" @blur="saveChanges(props.row, 'cijena')" />
              </q-td>
            </template>
            <template v-slot:body-cell-actions="props">
              <q-td :props="props" align="center">
                <q-btn flat round icon="delete" color="red" @click="deleteProduct(props.row.Sifra_proizvoda)" />
              </q-td>
            </template>
          </q-table>
        </q-card-section>
      </q-card>
  
      <q-dialog v-model="isDialogOpen">
        <q-card>
          <q-card-section>
            <div class="text-h6">{{ isEditing ? 'Uredi Proizvod' : 'Dodaj Proizvod' }}</div>
          </q-card-section>
          <q-card-section>
            <q-form @submit.prevent="isEditing ? updateProduct() : addProduct()">
              <q-input filled v-model="form.Naziv" label="Naziv" required />
              <q-input filled v-model="form.Marka" label="Marka" required />
              <q-input filled type="number" step="0.01" v-model="form.Cijena_proizvoda" label="Cijena" />
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
  
  const products = ref([]);
  const searchTerm = ref('');
  const isDialogOpen = ref(false);
  const isEditing = ref(false);
  const form = ref({
    Sifra_proizvoda: '',
    Naziv: '',
    Marka: '',
    Cijena_proizvoda: '',
  });
  
  const columns = [
    { name: 'Naziv', label: 'Naziv', field: 'Naziv', align: 'left' },
    { name: 'Marka', label: 'Marka', field: 'Marka', align: 'left' },
    { name: 'Cijena_proizvoda', label: 'Cijena', field: 'Cijena_proizvoda', align: 'left' },
    { name: 'actions', label: 'Akcije', align: 'center', sortable: false },
  ];
  
  const fetchProducts = async () => {
    const response = await axios.get(`${baseURL}/products`);
    products.value = response.data.map(product => ({
      ...product,
      isEditingNaziv: false,
      isEditingMarka: false,
      isEditingCijena: false,
    }));
  };
  
  const filteredProducts = computed(() => {
    if (!searchTerm.value) return products.value;
    const term = searchTerm.value.toLowerCase();
    return products.value.filter(p =>
      (p.Naziv || '').toLowerCase().includes(term) ||
      (p.Marka || '').toLowerCase().includes(term) ||
      (p.Cijena_proizvoda || '').toString().includes(term)
    );
  });
  
  const showAddProductDialog = () => {
    isEditing.value = false;
    form.value = {
      Naziv: '',
      Marka: '',
      Cijena_proizvoda: '',
    };
    isDialogOpen.value = true;
  };
  
  const editProduct = (product) => {
    isEditing.value = true;
    form.value = { ...product };
    isDialogOpen.value = true;
  };
  
  const addProduct = async () => {
    await axios.post(`${baseURL}/products`, form.value);
    fetchProducts();
    closeDialog();
  };
  
  const updateProduct = async () => {
    await axios.put(`${baseURL}/products/${form.value.Sifra_proizvoda}`, form.value);
    fetchProducts();
    closeDialog();
  };
  
  const deleteProduct = async (productId) => {
    await axios.delete(`${baseURL}/products/${productId}`);
    fetchProducts();
  };
  
  const closeDialog = () => {
    isDialogOpen.value = false;
  };
  
  const handleCategoryChange = (category) => {
    console.log('Odabrana kategorija:', category);
  };
  
  const enableEditing = (product, field) => {
    if (field === 'naziv') product.isEditingNaziv = true;
    if (field === 'marka') product.isEditingMarka = true;
    if (field === 'cijena') product.isEditingCijena = true;
  };
  
  const saveChanges = async (product, field) => {
    if (field === 'naziv') product.isEditingNaziv = false;
    if (field === 'marka') product.isEditingMarka = false;
    if (field === 'cijena') product.isEditingCijena = false;
    await axios.put(`${baseURL}/products/${product.Sifra_proizvoda}`, product);
    fetchProducts();
  };
  
  onMounted(fetchProducts);
  </script>