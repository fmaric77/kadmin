<script setup>
import { ref } from 'vue';
import axios from 'axios';
import { useRouter } from 'vue-router';

const baseURL = window.location.hostname === 'localhost' 
  ? 'http://localhost:3000/api' 
  : 'https://kadmin-7i923vaxr-goldenarchangels-projects.vercel.app/api';

const form = ref({
  username: '',
  password: '',
});

const errorMessage = ref('');

const router = useRouter();

const login = async () => {
  try {
    const response = await axios.post(`${baseURL}/login`, {
      username: form.value.username,
      password: form.value.password,
    });
    console.log('Login successful:', response.data);
    localStorage.setItem('authToken', response.data.token); // Store the token in local storage
    router.push('/admin-board'); // Redirect to admin board page
  } catch (error) {
    console.error('Login failed:', error.response.data.message);
    errorMessage.value = 'Pogrešno ime ili lozinka'; // Display error message
  }
};
</script>

<template>
  <q-page class="q-pa-md">
    <q-card>
      <q-card-section>
        <div class="text-h6">Login</div>
      </q-card-section>

      <q-card-section>
        <q-form @submit.prevent="login">
          <q-input
            filled
            v-model="form.username"
            label="Username"
            type="text"
            required
          />
          <q-input
            filled
            v-model="form.password"
            label="Password"
            type="password"
            required
          />
          <q-btn type="submit" label="Login" color="primary" class="q-mt-md" />
        </q-form>
        <div v-if="errorMessage" class="text-negative q-mt-md">{{ errorMessage }}</div>
      </q-card-section>
    </q-card>
  </q-page>
</template>