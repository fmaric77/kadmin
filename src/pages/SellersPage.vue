<template>
    <q-page class="q-pa-md">
      <q-card>
        <q-card-section>
          <div class="text-h6">Prodavači</div>
        </q-card-section>
        <q-card-section>
          <CategoryDropdown @categoryChanged="handleCategoryChange" />
          <q-input filled v-model="searchTerm" label="Pretraži" class="q-mb-md" />
          <q-btn @click="showAddSellerDialog" label="Dodaj Prodavača" color="primary" class="q-mb-md" />
          <q-table :rows="filteredSellers" :columns="columns" row-key="Sifra_prodavaca">
            <template v-slot:body-cell-Ime_prodavaca="props">
              <q-td :props="props">
                <div v-if="!props.row.isEditingName" @dblclick="enableEditing(props.row, 'name')">
                  {{ props.row.Ime_prodavaca }}
                </div>
                <q-input v-else v-model="props.row.Ime_prodavaca" @blur="saveChanges(props.row, 'name')" />
              </q-td>
            </template>
            <template v-slot:body-cell-Adresa_prodavaca="props">
              <q-td :props="props">
                <div v-if="!props.row.isEditingAddress" @dblclick="enableEditing(props.row, 'address')">
                  {{ props.row.Adresa_prodavaca }}
                </div>
                <q-input v-else v-model="props.row.Adresa_prodavaca" @blur="saveChanges(props.row, 'address')" />
              </q-td>
            </template>
            <template v-slot:body-cell-E_mail_prodavaca="props">
              <q-td :props="props">
                <div v-if="!props.row.isEditingEmail" @dblclick="enableEditing(props.row, 'email')">
                  {{ props.row.E_mail_prodavaca }}
                </div>
                <q-input v-else v-model="props.row.E_mail_prodavaca" @blur="saveChanges(props.row, 'email')" />
              </q-td>
            </template>
            <template v-slot:body-cell-actions="props">
              <q-td :props="props" align="center">
                <q-btn flat round icon="delete" color="red" @click="deleteSeller(props.row.Sifra_prodavaca)" />
              </q-td>
            </template>
          </q-table>
        </q-card-section>
      </q-card>
  
      <q-dialog v-model="isDialogOpen">
        <q-card>
          <q-card-section>
            <div class="text-h6">{{ isEditing ? 'Uredi Prodavača' : 'Dodaj Prodavača' }}</div>
          </q-card-section>
          <q-card-section>
            <q-form @submit.prevent="isEditing ? updateSeller() : addSeller()">
              <q-input filled v-model="form.Ime_prodavaca" label="Ime" required />
              <q-input filled v-model="form.Adresa_prodavaca" label="Adresa" />
              <q-input filled v-model="form.E_mail_prodavaca" label="Email" type="email" />
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
    : 'https://kadmin-ten.vercel.app/api';
  
  const sellers = ref([]);
  const searchTerm = ref('');
  const isDialogOpen = ref(false);
  const isEditing = ref(false);
  const form = ref({
    Ime_prodavaca: '',
    Adresa_prodavaca: '',
    E_mail_prodavaca: '',
  });
  
  const columns = [
    { name: 'Ime_prodavaca', label: 'Ime', field: 'Ime_prodavaca', align: 'left' },
    { name: 'Adresa_prodavaca', label: 'Adresa', field: 'Adresa_prodavaca', align: 'left' },
    { name: 'E_mail_prodavaca', label: 'Email', field: 'E_mail_prodavaca', align: 'left' },
    { name: 'actions', label: 'Akcije', align: 'center', sortable: false },
  ];
  
  const fetchSellers = async () => {
    const response = await axios.get(`${baseURL}/sellers`);
    sellers.value = response.data.map(seller => ({
      ...seller,
      isEditingName: false,
      isEditingAddress: false,
      isEditingEmail: false,
    }));
  };
  
  const filteredSellers = computed(() => {
    if (!searchTerm.value) return sellers.value;
    const term = searchTerm.value.toLowerCase();
    return sellers.value.filter(s =>
      (s.Ime_prodavaca || '').toLowerCase().includes(term) ||
      (s.Adresa_prodavaca || '').toLowerCase().includes(term) ||
      (s.E_mail_prodavaca || '').toLowerCase().includes(term)
    );
  });
  
  const showAddSellerDialog = () => {
    isEditing.value = false;
    form.value = {
      Ime_prodavaca: '',
      Adresa_prodavaca: '',
      E_mail_prodavaca: '',
    };
    isDialogOpen.value = true;
  };
  
  const addSeller = async () => {
    await axios.post(`${baseURL}/sellers`, form.value);
    fetchSellers();
    closeDialog();
  };
  
  const updateSeller = async () => {
    await axios.put(`${baseURL}/sellers/${form.value.Sifra_prodavaca}`, form.value);
    fetchSellers();
    closeDialog();
  };
  
  const deleteSeller = async (sellerId) => {
  if (confirm('Jeste li sigurni da želite izbrisati ovog prodavača?')) {
    try {
      await axios.delete(`${baseURL}/sellers/${sellerId}`);
      fetchSellers();
    } catch (error) {
      console.error('Error deleting seller:', error);
      alert('Došlo je do greške prilikom brisanja prodavača.');
    }
  }
};
  
  const closeDialog = () => {
    isDialogOpen.value = false;
  };
  
  const handleCategoryChange = (category) => {
    console.log('Odabrana kategorija:', category);
  };
  
  const enableEditing = (seller, field) => {
    if (field === 'name') seller.isEditingName = true;
    if (field === 'address') seller.isEditingAddress = true;
    if (field === 'email') seller.isEditingEmail = true;
  };
  
  const saveChanges = async (seller, field) => {
    if (field === 'name') seller.isEditingName = false;
    if (field === 'address') seller.isEditingAddress = false;
    if (field === 'email') seller.isEditingEmail = false;
    await axios.put(`${baseURL}/sellers/${seller.Sifra_prodavaca}`, seller);
    fetchSellers();
  };
  
  onMounted(fetchSellers);
  </script>