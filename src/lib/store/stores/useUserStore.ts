import { create } from 'zustand'

interface Usuario {
  nome: string
  email: string
  telefone: string
  avatar_url: string | null
  papel: string | null
}

interface UserStore {
  user: Usuario | null
  setUser: (dados: Usuario) => void
  clearUser: () => void
}

export const useUserStore = create<UserStore>((set) => ({
  user: null,
  setUser: (dados) => set({ user: dados }),
  clearUser: () => set({ user: null }),
}))
