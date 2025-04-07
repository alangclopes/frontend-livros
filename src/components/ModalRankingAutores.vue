<template>
  <div class="modal-overlay" @click.self="$emit('close')">
    <div class="modal-content">
      <h3>Ranking de Autores com Mais Livros</h3>
      <ul>
        <li v-for="autor in ranking" :key="autor.id">
          {{ autor.name }} - {{ autor.book_count }} livros
        </li>
      </ul>
      <button @click="$emit('close')">Fechar</button>
    </div>
  </div>
</template>

<script setup>
defineProps({
  ranking: Array
})
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}
.modal-content {
  background-color: white;
  padding: 2rem;
  border-radius: 12px;
  width: 90%;
  max-width: 500px;
}
button {
  margin-top: 1rem;
}
</style>
