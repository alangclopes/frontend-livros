<template>
  <div class="lista-livros">
    <h2>📚 Lista de Livros</h2>

    <input
      type="text"
      v-model="termoBusca"
      placeholder="Buscar por título..."
      class="input-busca"
    />

    <div
      v-for="livro in livrosFiltrados"
      :key="livro.id"
      class="livro-card"
    >
      <h3>{{ livro.title }}</h3>
      <p class="info"><strong>Publicado em:</strong> {{ formatarData(livro.publication_date) }}</p>
      <p class="info"><strong>Autor:</strong> {{ obterNomeAutor(livro.author) }}</p>

      <div class="botoes">
        <button @click="abrirEdicao(livro)">✏️ Editar</button>
        <button @click="removerLivro(livro.id)">🗑️ Remover</button>
      </div>
    </div>

    <div v-if="editarModal" class="modal-overlay">
      <div class="modal">
        <h3>✏️ Editar Livro</h3>
        <form @submit.prevent="salvarEdicao">
          <input v-model="formEdicao.title" placeholder="Título do livro" required />
          <input type="date" v-model="formEdicao.publication_date" required />
          <select v-model="formEdicao.author" required>
            <option disabled value="">Selecione um autor</option>
            <option v-for="autor in autores" :key="autor.id" :value="autor.id">
              {{ autor.name }}
            </option>
          </select>
          <div class="modal-botoes">
            <button type="submit">Salvar</button>
            <button type="button" class="cancelar" @click="editarModal = false">Cancelar</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useLivrosStore } from '../stores/livrosStore'
import { useToast } from 'vue-toastification'

const store = useLivrosStore()
const toast = useToast()

const termoBusca = ref('')
const editarModal = ref(false)
const formEdicao = ref({
  id: null,
  title: '',
  publication_date: '',
  author: ''
})

const livros = store.livros
const autores = store.autores

const formatarData = (dataISO) => {
  return new Date(dataISO).toLocaleDateString('pt-BR')
}

const obterNomeAutor = (id) => {
  const autor = autores.find(a => a.id === id)
  return autor ? autor.name : 'Desconhecido'
}

const livrosFiltrados = computed(() => {
  return livros.filter(livro =>
    livro.title.toLowerCase().includes(termoBusca.value.toLowerCase())
  )
})

const abrirEdicao = (livro) => {
  formEdicao.value = {
    id: livro.id,
    title: livro.title,
    publication_date: livro.publication_date,
    author: livro.author
  }
  editarModal.value = true
}

const salvarEdicao = async () => {
  try {
    await store.atualizarLivro(formEdicao.value)
    await store.carregarLivros()
    editarModal.value = false
    toast.success('Livro atualizado com sucesso!')
  } catch (e) {
    console.error(e)
    toast.error('Erro ao atualizar o livro!')
  }
}

const removerLivro = async (id) => {
  if (confirm('Tem certeza que deseja remover este livro?')) {
    await store.removerLivro(id)
    await store.carregarLivros()
    toast.success('Livro removido com sucesso!')
  }
}

onMounted(async () => {
  await store.carregarAutores()
  await store.carregarLivros()
})
</script>

<style scoped>
.lista-livros {
  padding: 2rem;
  max-width: 800px;
  margin: 0 auto;
  background-color: #f9f9f9;
  border-radius: 12px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

h2 {
  font-size: 1.8rem;
  margin-bottom: 1.5rem;
  color: #333;
  text-align: center;
}

.input-busca {
  width: 100%;
  padding: 0.7rem 1rem;
  margin-bottom: 1.5rem;
  border: 1px solid #ccc;
  border-radius: 8px;
  font-size: 1rem;
}

.livro-card {
  background-color: white;
  padding: 1rem 1.5rem;
  border-radius: 10px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05);
  margin-bottom: 1rem;
}

.botoes {
  display: flex;
  gap: 1rem;
  margin-top: 1rem;
}

.botoes button {
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 6px;
  font-weight: bold;
  cursor: pointer;
}

.botoes button:first-child {
  background-color: #f39c12;
  color: white;
}

.botoes button:last-child {
  background-color: #e74c3c;
  color: white;
}

/* Modal */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal {
  background: white;
  padding: 2rem;
  border-radius: 10px;
  width: 90%;
  max-width: 500px;
}

.modal-botoes {
  margin-top: 1rem;
  display: flex;
  gap: 1rem;
}

.modal-botoes .cancelar {
  background-color: #bdc3c7;
  color: white;
}
</style>
