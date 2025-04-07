import { defineStore } from 'pinia'
import axios from 'axios'

export const useLivrosStore = defineStore('livros', {
  state: () => ({
    livros: [],
    autores: []
  }),
  actions: {
    async carregarLivros() {
      const res = await axios.get('http://localhost:8000/api/livros/')
      this.livros = res.data
    },
    async carregarAutores() {
      const res = await axios.get('http://localhost:8000/api/autores/')
      this.autores = res.data
    },
    async atualizarLivro(livro) {
      await axios.put(`http://localhost:8000/api/livros/${livro.id}/`, {
        title: livro.title,
        publication_date: livro.publication_date,
        author: livro.author
      })
      await this.carregarLivros()
    },
    async removerLivro(id) {
      await axios.delete(`http://localhost:8000/api/livros/${id}/`)
      await this.carregarLivros()
    }
  }
})
