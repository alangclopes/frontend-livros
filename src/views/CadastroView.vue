<template>
  <div class="cadastro-livro">
    <h2>📘 Cadastrar Novo Livro</h2>

    <form @submit.prevent="enviarFormulario" class="formulario">
      <input v-model="form.title" placeholder="Título do livro" required />
      <input type="date" v-model="form.publication_date" required />

      <div class="autor-select">
        <select v-model="form.author" required>
          <option disabled value="">Selecione um autor</option>
          <option v-for="autor in store.autores" :key="autor.id" :value="autor.id">
            {{ autor.name }}
          </option>
        </select>
        <button type="button" @click="mostrarCadastroAutor = true" class="botao-adicionar-autor">➕</button>
      </div>

      <button type="submit">Cadastrar</button>
    </form>

    <!-- Modal para cadastro de novo autor -->
    <div v-if="mostrarCadastroAutor" class="modal-overlay">
      <div class="modal">
        <h3>➕ Novo Autor</h3>
        <input v-model="novoAutor" placeholder="Nome do autor" />
        <div class="modal-botoes">
          <button @click="cadastrarAutor">Salvar</button>
          <button class="cancelar" @click="mostrarCadastroAutor = false">Cancelar</button>
        </div>
      </div>
    </div>
  </div>
</template>


<script setup>
import { reactive, onMounted, ref } from 'vue'
import { useLivrosStore } from '../stores/livrosStore'
import { useToast } from 'vue-toastification'
import axios from 'axios'

const toast = useToast()
const store = useLivrosStore()

const form = reactive({
  title: '',
  publication_date: '',
  author: ''
})

const mostrarCadastroAutor = ref(false)
const novoAutor = ref('')

const enviarFormulario = async () => {
  if (!form.title || !form.publication_date || !form.author) {
    toast.warning('Preencha todos os campos!')
    return
  }

  try {
    await store.cadastrarLivro(form)
    toast.success('Livro cadastrado com sucesso!')

    form.title = ''
    form.publication_date = ''
    form.author = ''
  } catch (e) {
    console.error('Erro ao cadastrar livro:', e)
    toast.error('Erro ao cadastrar o livro!')
  }
}

const cadastrarAutor = async () => {
  if (!novoAutor.value.trim()) {
    toast.warning('Informe o nome do autor')
    return
  }

  try {
    await axios.post('http://localhost:8000/api/autores/', { name: novoAutor.value })
    toast.success('Autor cadastrado com sucesso!')
    novoAutor.value = ''
    mostrarCadastroAutor.value = false
    await store.carregarAutores()
  } catch (e) {
    console.error('Erro ao cadastrar autor:', e)
    toast.error('Erro ao cadastrar autor!')
  }
}

onMounted(() => {
  store.carregarAutores()
})
</script>

<style scoped>
.cadastro-livro {
  max-width: 600px;
  margin: 2rem auto;
  padding: 2rem;
  background: #fff;
  border: 1px solid #ddd;
  border-radius: 10px;
}

.formulario {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

input,
select {
  padding: 0.7rem;
  border-radius: 6px;
  border: 1px solid #ccc;
  font-size: 1rem;
}

button {
  padding: 0.7rem;
  background-color: #27ae60;
  color: white;
  border: none;
  border-radius: 6px;
  font-weight: bold;
  cursor: pointer;
}

button:hover {
  background-color: #1e8449;
}

.autor-select {
  display: flex;
  gap: 0.5rem;
  align-items: center;
}

.botao-adicionar-autor {
  background-color: #2980b9;
  border: none;
  color: white;
  border-radius: 6px;
  padding: 0.5rem;
  font-weight: bold;
}

.botao-adicionar-autor:hover {
  background-color: #1c6391;
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
}

.modal {
  background: white;
  padding: 2rem;
  border-radius: 10px;
  width: 300px;
  text-align: center;
}

.modal input {
  width: 100%;
  padding: 0.5rem;
  margin-top: 1rem;
  border-radius: 5px;
  border: 1px solid #ccc;
}

.modal-botoes {
  margin-top: 1rem;
  display: flex;
  justify-content: space-between;
}

.modal-botoes button.cancelar {
  background-color: #ccc;
  color: #333;
}
</style>
