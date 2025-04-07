import { defineStore } from 'pinia'
import axios from 'axios'

const baseURL = 'https://backend-livros-btws.onrender.com/api'

export const useLivrosStore = defineStore('livros', {
  state: () => ({
    livros: [],
    autores: []
  }),
  actions: {
    async carregarLivros() {
      const res = await axios.get(`${baseURL}/livros/`)
      this.livros = res.data
    },
    async carregarAutores() {
      const res = await axios.get(`${baseURL}/autores/`)
      this.autores = res.data
    },
    async atualizarLivro(livro) {
      await axios.put(`${baseURL}/livros/${livro.id}/`, {
        title: livro.title,
        publication_date: livro.publication_date,
        author: livro.author
      })
      await this.carregarLivros()
    },
    async removerLivro(id) {
      await axios.delete(`${baseURL}/livros/${id}/`)
      await this.carregarLivros()
    }
  }
})
