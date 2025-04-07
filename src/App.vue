<template>
  <div>
    <nav class="nav-bar">
      <router-link to="/">📚 Lista de Livros</router-link>
      <router-link to="/cadastro">➕ Cadastrar Livro</router-link>
      <button @click="abrirRanking">🏆 Ranking de Autores</button>
    </nav>

    <!-- Modal de Ranking de Autores -->
    <ModalRankingAutores
      v-if="mostrarRanking"
      :ranking="rankingAutores"
      @close="mostrarRanking = false"
    />

    <!-- Aqui é onde as rotas aparecem -->
    <router-view />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import axios from 'axios'
import ModalRankingAutores from './components/ModalRankingAutores.vue'

// Estado do modal e dados do ranking
const mostrarRanking = ref(false)
const rankingAutores = ref([])

const abrirRanking = async () => {
  try {
    const res = await axios.get('http://localhost:8000/api/autores/top/')
    rankingAutores.value = res.data
    mostrarRanking.value = true
  } catch (err) {
    console.error('Erro ao buscar ranking de autores:', err)
  }
}
</script>

<!-- Importa os estilos globais -->
<style>
@import './assets/styles.css';
</style>
