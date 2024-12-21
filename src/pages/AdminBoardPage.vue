<template>
    <q-page class="q-pa-md">
      <q-card>
        <q-card-section>
          <div class="text-h6">Admin Board</div>
        </q-card-section>
        <q-card-section>
          <CategoryDropdown @categoryChanged="handleCategoryChange" />
          <!-- Logout Button -->
          <q-btn @click="logout" label="Odjava" color="negative" class="q-mt-md" />
          <!-- Admin board content based on selected category -->
          <div v-if="selectedCategory" class="q-mt-md">
            <p>Selected Category: {{ selectedCategory }}</p>
            <!-- Add your content here based on the selected category -->
          </div>
          <div class="q-mt-md text-center">
            <img src="https://cdn-icons-png.flaticon.com/128/6024/6024190.png" width="10%" alt="admin icons" title="admin icons" />
          </div>
        </q-card-section>
      </q-card>
    </q-page>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import CategoryDropdown from 'src/components/CategoryDropdown.vue';

const selectedCategory = ref('');
const router = useRouter();

const handleCategoryChange = (category) => {
  selectedCategory.value = category;
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
    default:
      break;
  }
};

const logout = () => {
  localStorage.removeItem('authToken');
  router.push('/');
};
</script>