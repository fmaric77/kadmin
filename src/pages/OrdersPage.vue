<template>
    <q-page class="q-pa-md">
      <q-card>
        <q-card-section>
          <div class="text-h6">Narudžbe</div>
        </q-card-section>
        <q-card-section>
          <CategoryDropdown @categoryChanged="handleCategoryChange" />
          <q-input filled v-model="searchTerm" label="Pretraži" class="q-mb-md" />
          <q-btn @click="showAddOrderDialog" label="Dodaj Narudžbu" color="primary" class="q-mb-md" />
          <q-table :rows="filteredOrders" :columns="columns" row-key="Sifra_narudzbe">
            <template v-slot:body-cell-Sifra_narudzbe="props">
              <q-td :props="props">{{ props.row.Sifra_narudzbe }}</q-td>
            </template>
            <template v-slot:body-cell-Kupac="props">
              <q-td :props="props">{{ getCustomerName(props.row.SIFRA_KUPCA) }}</q-td>
            </template>
            <template v-slot:body-cell-Prodavac="props">
              <q-td :props="props">{{ getSellerName(props.row.SIFRA_PRODAVACA) }}</q-td>
            </template>
            <template v-slot:body-cell-Datum_narudzbe="props">
                <q-td :props="props">{{ formatDate(props.row.Datum_narudzbe) }}</q-td>
            </template>
            <template v-slot:body-cell-Nacin_placanja="props">
              <q-td :props="props">{{ props.row.Nacin_placanja }}</q-td>
            </template>
            <template v-slot:body-cell-Cijena_narudzbe="props">
              <q-td :props="props">{{ props.row.Cijena_narudzbe }}</q-td>
            </template>
            <template v-slot:body-cell-actions="props">
              <q-td :props="props" align="center">
                <q-btn flat round icon="delete" color="red" @click="deleteOrder(props.row.Sifra_narudzbe)" />
              </q-td>
            </template>
          </q-table>
        </q-card-section>
      </q-card>
  
      <q-dialog v-model="isDialogOpen">
        <q-card>
          <q-card-section>
            <div class="text-h6">{{ isEditing ? 'Uredi Narudžbu' : 'Dodaj Narudžbu' }}</div>
          </q-card-section>
          <q-card-section>
            <q-form @submit.prevent="isEditing ? updateOrder() : addOrder()">
              <q-select
                filled
                v-model="form.SIFRA_KUPCA"
                :options="customers"
                label="Kupac"
                required
                emit-value
                map-options
              />
              <q-select
                filled
                v-model="form.SIFRA_PRODAVACA"
                :options="sellers"
                label="Prodavač"
                required
                emit-value
                map-options
              />
              <q-input
                filled
                v-model="form.Datum_narudzbe"
                label="Datum narudžbe"
                type="date"
                required
              />
              <q-select
                filled
                v-model="form.Nacin_placanja"
                :options="paymentMethods"
                label="Način plaćanja"
                required
                emit-value
                map-options
              />
              <q-input
                filled
                v-model.number="form.Cijena_narudzbe"
                label="Cijena narudžbe"
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
  
  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('hr-HR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };
  
  const orders = ref([]);
  const customers = ref([]);
  const sellers = ref([]);
  const searchTerm = ref('');
  const isDialogOpen = ref(false);
  const isEditing = ref(false);
  const form = ref({
    SIFRA_KUPCA: null,
    SIFRA_PRODAVACA: null,
    Datum_narudzbe: '',
    Nacin_placanja: '',
    Cijena_narudzbe: null,
  });
  
  const paymentMethods = [
    { label: 'Gotovina', value: 'Gotovina' },
    { label: 'Kreditna kartica', value: 'Kreditna kartica' },
    { label: 'Bankovni prijenos', value: 'Bankovni prijenos' },
    { label: 'Kripto valuta', value: 'Kripto valuta' },
  ];
  
  const columns = [
    { name: 'Sifra_narudzbe', label: 'Šifra narudžbe', field: 'Sifra_narudzbe', align: 'left' },
    { name: 'Kupac', label: 'Kupac', field: 'Kupac', align: 'left' },
    { name: 'Prodavac', label: 'Prodavač', field: 'Prodavac', align: 'left' },
    { name: 'Datum_narudzbe', label: 'Datum narudžbe', field: 'Datum_narudzbe', align: 'left' },
    { name: 'Nacin_placanja', label: 'Način plaćanja', field: 'Nacin_placanja', align: 'left' },
    { name: 'Cijena_narudzbe', label: 'Cijena narudžbe', field: 'Cijena_narudzbe', align: 'left' },
    { name: 'actions', label: 'Akcije', align: 'center', sortable: false },
  ];
  
  const fetchOrders = async () => {
    try {
      const response = await axios.get(`${baseURL}/orders`);
      orders.value = response.data;
    } catch (error) {
      console.error('Error fetching orders:', error);
    }
  };
  
  const fetchCustomers = async () => {
    try {
      const response = await axios.get(`${baseURL}/customers`);
      customers.value = response.data.map(customer => ({
        label: `${customer.Ime_kupca} ${customer.Prezime_kupca}`,
        value: customer.Sifra_kupca,
      }));
    } catch (error) {
      console.error('Error fetching customers:', error);
    }
  };
  
  const fetchSellers = async () => {
    try {
      const response = await axios.get(`${baseURL}/sellers`);
      sellers.value = response.data.map(seller => ({
        label: seller.Ime_prodavaca,
        value: seller.Sifra_prodavaca,
      }));
    } catch (error) {
      console.error('Error fetching sellers:', error);
    }
  };
  
  const filteredOrders = computed(() => {
    if (!searchTerm.value) return orders.value;
    const term = searchTerm.value.toLowerCase();
    return orders.value.filter(order => {
      const customerName = getCustomerName(order.SIFRA_KUPCA).toLowerCase();
      const sellerName = getSellerName(order.SIFRA_PRODAVACA).toLowerCase();
      const formattedDate = formatDate(order.Datum_narudzbe);
      
      return customerName.includes(term) ||
             sellerName.includes(term) ||
             formattedDate.includes(term) ||
             (order.Nacin_placanja || '').toLowerCase().includes(term) ||
             (order.Cijena_narudzbe || '').toString().includes(term) ||
             (order.Sifra_narudzbe || '').toString().includes(term);
    });
  });
  
  const showAddOrderDialog = () => {
    isEditing.value = false;
    form.value = {
      SIFRA_KUPCA: null,
      SIFRA_PRODAVACA: null,
      Datum_narudzbe: '',
      Nacin_placanja: '',
      Cijena_narudzbe: null,
    };
    isDialogOpen.value = true;
  };
  
  const validateForm = () => {
    return (
      form.value.SIFRA_KUPCA !== null &&
      form.value.SIFRA_PRODAVACA !== null &&
      form.value.Datum_narudzbe !== '' &&
      form.value.Nacin_placanja !== '' &&
      form.value.Cijena_narudzbe !== null
    );
  };
  
  const addOrder = async () => {
    if (!validateForm()) {
      alert('Sva polja moraju biti popunjena.');
      return;
    }
    try {
      const orderData = {
        SIFRA_KUPCA: form.value.SIFRA_KUPCA,
        SIFRA_PRODAVACA: form.value.SIFRA_PRODAVACA,
        Datum_narudzbe: form.value.Datum_narudzbe,
        Nacin_placanja: form.value.Nacin_placanja,
        Cijena_narudzbe: form.value.Cijena_narudzbe,
      };
      await axios.post(`${baseURL}/orders`, orderData);
      fetchOrders();
      closeDialog();
    } catch (error) {
      console.error('Error adding order:', error);
      alert('Došlo je do greške prilikom dodavanja narudžbe.');
    }
  };
  
  const updateOrder = async () => {
    if (!validateForm()) {
      alert('Sva polja moraju biti popunjena.');
      return;
    }
    try {
      const orderData = {
        SIFRA_KUPCA: form.value.SIFRA_KUPCA,
        SIFRA_PRODAVACA: form.value.SIFRA_PRODAVACA,
        Datum_narudzbe: form.value.Datum_narudzbe,
        Nacin_placanja: form.value.Nacin_placanja,
        Cijena_narudzbe: form.value.Cijena_narudzbe,
      };
      await axios.put(`${baseURL}/orders/${form.value.Sifra_narudzbe}`, orderData);
      fetchOrders();
      closeDialog();
    } catch (error) {
      console.error('Error updating order:', error);
      alert('Došlo je do greške prilikom ažuriranja narudžbe.');
    }
  };
  
  const deleteOrder = async (orderId) => {
    if (!confirm('Jeste li sigurni da želite izbrisati ovu narudžbu?')) return;
    try {
      await axios.delete(`${baseURL}/orders/${orderId}`);
      fetchOrders();
    } catch (error) {
      console.error('Error deleting order:', error);
      alert('Došlo je do greške prilikom brisanja narudžbe.');
    }
  };
  
  const closeDialog = () => {
    isDialogOpen.value = false;
  };
  
  const handleCategoryChange = (category) => {
    console.log('Odabrana kategorija:', category);
  };
  
  const getCustomerName = (id) => {
    const customer = customers.value.find(c => c.value === id);
    return customer ? customer.label : 'Nepoznat kupac';
  };
  
  const getSellerName = (id) => {
    const seller = sellers.value.find(s => s.value === id);
    return seller ? seller.label : 'Nepoznat prodavač';
  };
  
  onMounted(() => {
    fetchOrders();
    fetchCustomers();
    fetchSellers();
  });
  </script>
  
  <style scoped>
  /* Add any scoped styles here */
  </style>