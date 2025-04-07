<template>
  <div class="cadastro-livro">
    <h2>Cadastrar Novo Livro</h2>

    <form @submit.prevent="enviarFormulario">
      <input v-model="form.title" placeholder="Título" required />
      <input type="date" v-model="form.publication_date" required />

      <select v-model="form.author" required>
        <option disabled value="">Selecione um autor</option>
        <option v-for="autor in store.autores" :key="autor.id" :value="autor.id">
          {{ autor.name }}
        </option>
      </select>

      <button type="submit">Cadastrar</button>
    </form>
  </div>
</template>

<script setup>
import { reactive, onMounted } from 'vue'
import { useLivrosStore } from '../stores/livrosStore'
import { useToast } from 'vue-toastification'

const toast = useToast()
const store = useLivrosStore()

const form = reactive({
  title: '',
  publication_date: '',
  author: ''
})

const enviarFormulario = async () => {
  console.log('Enviando:', JSON.stringify(form))

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

onMounted(() => {
  store.carregarAutores()
})
</script>
