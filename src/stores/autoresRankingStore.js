import { defineStore } from 'pinia'
import axios from 'axios'

export const useAutoresRankingStore = defineStore('autoresRanking', {
  state: () => ({
    topAutores: [],
  }),
  actions: {
    async carregarRanking() {
      try {
        const response = await axios.get('https://backend-livros-btws.onrender.com/api/autores/top/')
        this.topAutores = response.data
      } catch (error) {
        console.error('Erro ao carregar ranking de autores:', error)
      }
    },
  },
})
