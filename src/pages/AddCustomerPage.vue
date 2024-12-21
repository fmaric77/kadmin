<template>
  <q-page class="q-pa-md">
    <!-- Glavni kartični prikaz -->
    <q-card>
      <q-card-section>
        <div class="text-h6">Dodaj novog kupca</div>
      </q-card-section>

      <!-- Forma za unos podataka -->
      <q-card-section>
        <q-form @submit.prevent="addCustomer">
          <q-input filled v-model="form.name" label="Ime" required />
          <q-input filled v-model="form.surname" label="Prezime" required />
          <q-input
            filled
            v-model="form.email"
            label="Email"
            type="email"
            required
          />
          <q-input
            filled
            v-model="form.phone"
            label="Telefon"
            type="tel"
            required
          />
          <q-input filled v-model="form.address" label="Adresa" required />
          <q-btn type="submit" label="Dodaj" color="primary" class="q-mt-md" />
          <q-btn
            type="reject"
            label="Poništi"
            color="warning"
            class="q-mt-md"
          />
        </q-form>
      </q-card-section>
    </q-card>
  </q-page>
</template>
<script>
import { ref } from "vue";

export default {
  name: "AddCustomerPage",
  setup() {
    const form = ref({
      name: "",
      surname: "",
      email: "",
      phone: "",
      address: "",
    });

    const addCustomer = () => {
      console.log("Customer added:", form.value);

      // Reset form
      form.value = {
        name: "",
        surname: "",
        email: "",
        phone: "",
        address: "",
      };
    };

    return {
      form,
      addCustomer,
    };
  },
};
</script>
