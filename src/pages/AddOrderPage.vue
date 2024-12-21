<template>
  <q-page class="q-pa-md">
    <!-- Glavni kartični prikaz -->
    <q-card>
      <q-card-section>
        <div class="text-h6">Dodaj narudžbu</div>
      </q-card-section>

      <!-- Forma za unos podataka -->
      <q-card-section>
        <q-form @submit.prevent="addOrder">
          <q-input
            filled
            v-model="form.orderCode"
            label="Šifra narudžbe"
            type="number"
            required
            @update:model-value="validateInteger"
          />
          <q-input
            filled
            v-model="form.sellerCode"
            label="Šifra prodavača"
            type="number"
            required
            @update:model-value="validateInteger"
          />
          <q-input
            filled
            v-model="form.customerCode"
            label="Šifra kupca"
            type="number"
            required
            @update:model-value="validateInteger"
          />
          <q-input
            filled
            v-model="form.orderDate"
            label="Datum narudžbe"
            type="date"
            required
          />
          <q-input
            filled
            v-model="form.name"
            label="Ime"
            type="text"
            required
          />

          <q-btn type="submit" label="Dodaj" color="primary" class="q-mt-md" />
          <q-btn
            type="button"
            label="Poništi"
            color="warning"
            class="q-mt-md"
            @click="resetForm"
          />
        </q-form>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script>
import { ref } from "vue";

export default {
  name: "AddOrderPage",
  setup() {
    const form = ref({
      orderCode: "",
      sellerCode: "",
      customerCode: "",
      orderDate: "",
      name: "",
    });

    const addOrder = () => {
      console.log("Narudžba dodana:", form.value);

      // Resetiranje forme
      resetForm();
    };

    const validateInteger = (value) => {
      if (!Number.isInteger(value)) {
        return "Molimo unesite cijeli broj!";
      }
      return true;
    };

    const resetForm = () => {
      form.value = {
        orderCode: "",
        sellerCode: "",
        customerCode: "",
        orderDate: "",
        name: "",
      };
    };

    return {
      form,
      addOrder,
      resetForm,
      validateInteger,
    };
  },
};
</script>
