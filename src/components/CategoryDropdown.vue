<template>
    <q-select
      filled
      v-model="selectedCategory"
      :options="categories"
      label="Odaberi kategoriju"
      @update:model-value="handleCategoryChange"
    />
  </template>
  
  <script setup>
  import { ref } from 'vue';
  import { useRouter } from 'vue-router';
  
  const emit = defineEmits(['categoryChanged']);
  const router = useRouter();
  
  const categories = [
  { label: 'Kupci', value: 'KUPAC' },
    { label: 'Prodavači', value: 'PRODAVAC' },
    { label: 'Narudžbe', value: 'NARUDZBA' },
    { label: 'Proizvodi na narudžbi', value: 'PROIZVOD_NA_NARUDZBI' },
    { label: 'Proizvodi', value: 'PROIZVOD' },
     // Added new category

  ];
  
  const selectedCategory = ref(null);
  
  const handleCategoryChange = (category) => {
    selectedCategory.value = category;
    emit('categoryChanged', category);
    // Navigate to the corresponding page based on the selected category
    switch (category.value) {
      case 'KUPAC':
        router.push('/customers');
        break;
      case 'PRODAVAC':
        router.push('/sellers');
        break;
      case 'NARUDZBA':
        router.push('/orders');
        break;
      case 'PROIZVOD_NA_NARUDZBI':
        router.push('/products-on-order');
        break;
      case 'PROIZVOD': // Added new case
        router.push('/products');
        break;
      default:
        break;
    }
};
  </script>