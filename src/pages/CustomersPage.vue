<template>
  <q-page class="q-pa-md">
    <q-card>
      <q-card-section>
        <div class="text-h6">Kupci</div>
      </q-card-section>
      <q-card-section>
        <CategoryDropdown @categoryChanged="handleCategoryChange" />
        <!-- Search input -->
        <q-input filled v-model="searchTerm" label="Pretraži" class="q-mb-md" />
        <q-btn @click="showAddCustomerDialog" label="Dodaj Kupca" color="primary" class="q-mb-md" />
        <q-table
          :rows="filteredCustomers"
          :columns="columns"
          row-key="Sifra_kupca"
        >
          <template v-slot:body-cell-Ime_kupca="props">
            <q-td :props="props">
              <div v-if="!props.row.isEditingName" @dblclick="enableEditing(props.row, 'name')" @touchstart="enableEditing(props.row, 'name')">
                {{ props.row.Ime_kupca }}
              </div>
              <q-input v-else v-model="props.row.Ime_kupca" @blur="saveChanges(props.row, 'name')" />
            </q-td>
          </template>
          <template v-slot:body-cell-Prezime_kupca="props">
            <q-td :props="props">
              <div v-if="!props.row.isEditingSurname" @dblclick="enableEditing(props.row, 'surname')" @touchstart="enableEditing(props.row, 'surname')">
                {{ props.row.Prezime_kupca }}
              </div>
              <q-input v-else v-model="props.row.Prezime_kupca" @blur="saveChanges(props.row, 'surname')" />
            </q-td>
          </template>
          <template v-slot:body-cell-Adresa_kupca="props">
            <q-td :props="props">
              <div v-if="!props.row.isEditingAddress" @dblclick="enableEditing(props.row, 'address')" @touchstart="enableEditing(props.row, 'address')">
                {{ props.row.Adresa_kupca }}
              </div>
              <q-input v-else v-model="props.row.Adresa_kupca" @blur="saveChanges(props.row, 'address')" />
            </q-td>
          </template>
          <template v-slot:body-cell-E_mail="props">
            <q-td :props="props">
              <div v-if="!props.row.isEditingEmail" @dblclick="enableEditing(props.row, 'email')" @touchstart="enableEditing(props.row, 'email')">
                {{ props.row.E_mail }}
              </div>
              <q-input v-else v-model="props.row.E_mail" @blur="saveChanges(props.row, 'email')" />
            </q-td>
          </template>
          <template v-slot:body-cell-actions="props">
            <q-td :props="props" align="center">
              <q-btn flat round icon="delete" color="red" @click="deleteCustomer(props.row.Sifra_kupca)" />
            </q-td>
          </template>
        </q-table>
      </q-card-section>
    </q-card>

    <q-dialog v-model="isDialogOpen">
      <q-card>
        <q-card-section>
          <div class="text-h6">{{ isEditing ? 'Uredi Kupca' : 'Dodaj Kupca' }}</div>
        </q-card-section>
        <q-card-section>
          <q-form @submit.prevent="isEditing ? updateCustomer() : addCustomer()">
            <q-input filled v-model="form.Ime_kupca" label="Ime" required />
            <q-input filled v-model="form.Prezime_kupca" label="Prezime" required />
            <q-input filled v-model="form.Adresa_kupca" label="Adresa" />
            <q-input filled v-model="form.E_mail" label="Email" type="email" />
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

const customers = ref([]);
const searchTerm = ref('');
const isDialogOpen = ref(false);
const isEditing = ref(false);
const form = ref({
  Ime_kupca: '',
  Prezime_kupca: '',
  Adresa_kupca: '',
  E_mail: '',
});

const columns = [
  { name: 'Ime_kupca', label: 'Ime', field: 'Ime_kupca', align: 'left' },
  { name: 'Prezime_kupca', label: 'Prezime', field: 'Prezime_kupca', align: 'left' },
  { name: 'Adresa_kupca', label: 'Adresa', field: 'Adresa_kupca', align: 'left' },
  { name: 'E_mail', label: 'Email', field: 'E_mail', align: 'left' },
  { name: 'actions', label: 'Akcije', align: 'center', sortable: false },
];

const fetchCustomers = async () => {
  const response = await axios.get('http://localhost:3000/api/customers');
  customers.value = response.data.map(customer => ({
    ...customer,
    isEditingName: false,
    isEditingSurname: false,
    isEditingAddress: false,
    isEditingEmail: false,
  }));
};

const filteredCustomers = computed(() => {
  if (!searchTerm.value) return customers.value;
  const term = searchTerm.value.toLowerCase();
  return customers.value.filter(c =>
    (c.Ime_kupca || '').toLowerCase().includes(term) ||
    (c.Prezime_kupca || '').toLowerCase().includes(term) ||
    (c.Adresa_kupca || '').toLowerCase().includes(term) ||
    (c.E_mail || '').toLowerCase().includes(term)
  );
});

const showAddCustomerDialog = () => {
  isEditing.value = false;
  form.value = {
    Ime_kupca: '',
    Prezime_kupca: '',
    Adresa_kupca: '',
    E_mail: '',
  };
  isDialogOpen.value = true;
};

const editCustomer = (customer) => {
  isEditing.value = true;
  form.value = { ...customer };
  isDialogOpen.value = true;
};

const addCustomer = async () => {
  await axios.post('http://localhost:3000/api/customers', form.value);
  fetchCustomers();
  closeDialog();
};

const updateCustomer = async () => {
  await axios.put(`http://localhost:3000/api/customers/${form.value.Sifra_kupca}`, form.value);
  fetchCustomers();
  closeDialog();
};

const deleteCustomer = async (customerId) => {
  await axios.delete(`http://localhost:3000/api/customers/${customerId}`);
  fetchCustomers();
};

const closeDialog = () => {
  isDialogOpen.value = false;
};

const handleCategoryChange = (category) => {
  console.log('Odabrana kategorija:', category);
};

const enableEditing = (customer, field) => {
  if (field === 'name') customer.isEditingName = true;
  if (field === 'surname') customer.isEditingSurname = true;
  if (field === 'address') customer.isEditingAddress = true;
  if (field === 'email') customer.isEditingEmail = true;
};

const saveChanges = async (customer, field) => {
  if (field === 'name') customer.isEditingName = false;
  if (field === 'surname') customer.isEditingSurname = false;
  if (field === 'address') customer.isEditingAddress = false;
  if (field === 'email') customer.isEditingEmail = false;
  await axios.put(`http://localhost:3000/api/customers/${customer.Sifra_kupca}`, customer);
  fetchCustomers();
};

onMounted(fetchCustomers);
</script>