<template>
  <div class="lista-livros">
    <input v-model="busca" placeholder="🔍 Buscar livro por título" class="campo-busca" />

    <div v-if="livrosFiltrados.length">
      <div v-for="livro in livrosFiltrados" :key="livro.id" class="livro-card">
        <h3>{{ livro.title }}</h3>
        <p>📅 Publicação: {{ livro.publication_date || 'Data não informada' }}</p>
        <p>✍️ Autor: {{ livro.author?.name || 'Autor desconhecido' }}</p>

        <div class="botoes">
          <button @click="abrirEdicao(livro)">✏️ Editar</button>
          <button @click="removerLivro(livro.id)">🗑️ Remover</button>
        </div>
      </div>
    </div>
    <p v-else>Nenhum livro encontrado.</p>

    <!-- Modal de edição -->
    <div v-if="editarModal" class="modal-overlay">
      <div class="modal">
        <h3>✏️ Editar Livro</h3>
        <form @submit.prevent="salvarEdicao">
          <input v-model="formEdicao.title" placeholder="Título do livro" required />
          <input type="date" v-model="formEdicao.publication_date" required />
          <select v-model="formEdicao.author" required>
            <option disabled value="">Selecione um autor</option>
            <option v-for="autor in store.autores" :key="autor.id" :value="autor.id">
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

const busca = ref('')
const editarModal = ref(false)
const formEdicao = ref({
  id: null,
  title: '',
  publication_date: '',
  author: ''
})

const toast = useToast()
const store = useLivrosStore()

onMounted(() => {
  store.carregarLivros()
  store.carregarAutores()
})

const livrosFiltrados = computed(() => {
  return store.livros.filter((livro) =>
    livro.title.toLowerCase().includes(busca.value.toLowerCase())
  )
})

const abrirEdicao = (livro) => {
  formEdicao.value = {
    id: livro.id,
    title: livro.title,
    publication_date: livro.publication_date,
    author: typeof livro.author === 'object' ? livro.author.id : livro.author
  }
  editarModal.value = true
}

const salvarEdicao = async () => {
  try {
    await store.atualizarLivro(formEdicao.value)
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
    toast.success('Livro removido com sucesso!')
  }
}
</script>

<style scoped>
.lista-livros {
  max-width: 800px;
  margin: 2rem auto;
  padding: 1rem;
}
.campo-busca {
  padding: 0.7rem;
  margin-bottom: 1.5rem;
  width: 100%;
  font-size: 1rem;
  border: 1px solid #ccc;
  border-radius: 6px;
}
.livro-card {
  background: #f9f9f9;
  border: 1px solid #ddd;
  border-radius: 10px;
  padding: 1rem;
  margin-bottom: 1.5rem;
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
