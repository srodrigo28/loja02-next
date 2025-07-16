'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/lib/supabaseClient'
import { motion, AnimatePresence } from 'framer-motion'

export default function CadastroPage() {
  const [nome, setNome] = useState('')
  const [telefone, setTelefone] = useState('')
  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const [erro, setErro] = useState('')
  const router = useRouter()

  async function handleCadastro(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setErro('')

    if (!nome || !telefone || !email || !senha) {
      setErro('Preencha todos os campos.')
      return
    }

    const senhaForte = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{6,}$/
    if (!senhaForte.test(senha)) {
      setErro('A senha deve ter ao menos 6 caracteres, incluindo maiúscula, minúscula e número.')
      return
    }

    try {
      const { data, error: signUpError } = await supabase.auth.signUp({
        email,
        password: senha
      })

      if (signUpError) {
        if (signUpError.message.includes('User already registered')) {
          setErro('Este e-mail já está cadastrado.')
        } else {
          setErro(signUpError.message)
        }
        return
      }

      const user_id = data.user?.id
      if (!user_id) {
        setErro('Erro ao obter ID do usuário.')
        return
      }

      const { error: insertError } = await supabase.from('usuarios').insert([
        {
          user_id,
          nome,
          telefone,
          email,
          senha
        }
      ])

      if (insertError) {
        if (insertError.message.includes('duplicate key value')) {
          setErro('Este e-mail já existe na base de dados.')
        } else {
          setErro('Erro ao salvar os dados extras.')
        }
        return
      }

      router.push('/dashboard')
    } catch (err) {
      console.error(err)
      setErro('Erro inesperado ao cadastrar.')
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-100 via-white to-blue-100 flex items-center justify-center px-4 py-12 transition-all duration-500">
      <motion.form
        onSubmit={handleCadastro}
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="bg-white p-8 rounded-3xl shadow-2xl w-full max-w-md space-y-5 border border-gray-200"
      >
        <h2 className="text-3xl font-bold text-center text-green-600">Criar Conta</h2>

        <AnimatePresence>
          {erro && (
            <motion.p
              key="erro"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="text-red-500 text-sm text-center bg-red-50 border border-red-300 rounded p-2"
            >
              {erro}
            </motion.p>
          )}
        </AnimatePresence>

        <input
          type="text"
          placeholder="Nome completo"
          className="w-full border px-4 py-3 rounded-lg text-slate-800 focus:outline-none focus:ring-2 focus:ring-green-400 transition"
          value={nome}
          onChange={(e) => setNome(e.target.value)}
        />
        <input
          type="tel"
          placeholder="Telefone"
          className="w-full border px-4 py-3 rounded-lg text-slate-800 focus:outline-none focus:ring-2 focus:ring-green-400 transition"
          value={telefone}
          onChange={(e) => setTelefone(e.target.value)}
        />
        <input
          type="email"
          placeholder="E-mail"
          className="w-full border px-4 py-3 rounded-lg text-slate-800 focus:outline-none focus:ring-2 focus:ring-green-400 transition"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Senha"
          className="w-full border px-4 py-3 rounded-lg text-slate-800 focus:outline-none focus:ring-2 focus:ring-green-400 transition"
          value={senha}
          onChange={(e) => setSenha(e.target.value)}
        />
        <motion.button
          whileTap={{ scale: 0.95 }}
          whileHover={{ scale: 1.02 }}
          type="submit"
          className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition-all duration-300"
        >
          Cadastrar
        </motion.button>
      </motion.form>
    </div>
  )
}
