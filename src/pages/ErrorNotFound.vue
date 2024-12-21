<template>
  <div class="fullscreen bg-sand text-white text-center q-pa-md flex flex-center">
    <div>
      <div style="font-size: 30vh; font-weight: bold;">
        404
      </div>

      <div class="text-h2 q-mt-md" style="opacity:.8; font-style: italic;">
        Ups! Ovdje nema ničega...
      </div>

      <div class="text-h6 q-mt-md" style="opacity:.7">
        Izgleda da ste zalutali u digitalnu pustinju!<br>
        Možda ste tražili oazu, ali našli ste samo pijesak.<br>
        <span style="font-size: 2em;">🏜️</span>
      </div>

      <q-btn
        class="q-mt-xl"
        color="yellow"
        text-color="red"
        unelevated
        to="/"
        label="Vrati se nazad"
        no-caps
        icon="home"
      />
    </div>
  </div>
</template>

<script setup>
defineOptions({
  name: 'ErrorNotFound'
});
</script>

<style scoped>
.fullscreen {
  background: url('https://i.pinimg.com/originals/c8/4c/02/c84c02e693ca67f609942779373fe238.jpg') no-repeat center center;
  background-size: cover;
}
</style>