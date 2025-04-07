import { defineStore } from 'pinia'
import axios from 'axios'

export const useAutoresRankingStore = defineStore('autoresRanking', {
  state: () => ({
    topAutores: [],
  }),
  actions: {
    async carregarRanking() {
      try {
        const response = await axios.get('http://localhost:8000/api/autores/top/')
        this.topAutores = response.data
      } catch (error) {
        console.error('Erro ao carregar ranking de autores:', error)
      }
    },
  },
})
