'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { supabase } from '@/lib/lib/supabaseClient'

export default function LoginPage() {
  const [isCadastro, setIsCadastro] = useState(false)
  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const [nome, setNome] = useState('')
  const [telefone, setTelefone] = useState('')
  const [erro, setErro] = useState('')
  const router = useRouter()

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) router.push('/dashboard')
    })
  }, [])

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setErro('')
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password: senha })
      if (error) throw error
      router.push('/dashboard')
    } catch (err: any) {
      setErro('E-mail ou senha inválidos.')
    }
  }

  async function handleCadastro(e: React.FormEvent) {
    e.preventDefault()
    setErro('')
    if (!nome || !telefone || !email || !senha) return setErro('Preencha todos os campos.')
    try {
      const { data, error: signUpError } = await supabase.auth.signUp({ email, password: senha })
      if (signUpError) throw signUpError

      const user_id = data.user?.id
      if (!user_id) throw new Error('Erro ao obter ID do usuário.')

      const { error: insertError } = await supabase.from('usuarios').insert({ nome, telefone, email, user_id })
      if (insertError) throw insertError

      router.push('/dashboard')
    } catch (err: any) {
      setErro(err.message || 'Erro ao cadastrar.')
    }
  }

  return (
    <motion.div
      initial={{ backgroundColor: '#f3f4f6' }}
      animate={{ backgroundColor: isCadastro ? '#d1fae5' : '#eff6ff' }}
      className="min-h-screen flex items-center justify-center px-4 transition-colors duration-500"
    >
      <div className="bg-white p-8 rounded-xl shadow-xl w-full max-w-md relative overflow-hidden">
        <AnimatePresence mode="wait">
          {!isCadastro ? (
            <motion.form
              key="login"
              onSubmit={handleLogin}
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 50 }}
              transition={{ duration: 0.4 }}
              className="space-y-4"
            >
              <h2 className="text-2xl font-bold text-center text-sky-600">Entrar</h2>
              {erro && <p className="text-red-500 text-sm text-center">{erro}</p>}
              <input
                type="email"
                placeholder="E-mail"
                className="w-full border px-4 py-2 rounded text-gray-700"
                value={email}
                onChange={e => setEmail(e.target.value)}
              />
              <input
                type="password"
                placeholder="Senha"
                className="w-full border px-4 py-2 rounded text-gray-700"
                value={senha}
                onChange={e => setSenha(e.target.value)}
              />
              <button className="w-full bg-sky-600 text-white py-2 rounded hover:bg-sky-700 transition">Entrar</button>
              <p className="text-sm text-center">
                Não tem conta?{' '}
                <button type="button" onClick={() => setIsCadastro(true)} className="text-sky-600 hover:underline">
                  Cadastre-se
                </button>
              </p>
            </motion.form>
          ) : (
            <motion.form
              key="cadastro"
              onSubmit={handleCadastro}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.4 }}
              className="space-y-4"
            >
              <h2 className="text-2xl font-bold text-center text-green-600">Criar Conta</h2>
              {erro && <p className="text-red-500 text-sm text-center">{erro}</p>}
              <input
                type="text"
                placeholder="Nome completo"
                className="w-full border px-4 py-2 rounded text-gray-700"
                value={nome}
                onChange={e => setNome(e.target.value)}
              />
              <input
                type="tel"
                placeholder="Telefone"
                className="w-full border px-4 py-2 rounded text-gray-700"
                value={telefone}
                onChange={e => setTelefone(e.target.value)}
              />
              <input
                type="email"
                placeholder="E-mail"
                className="w-full border px-4 py-2 rounded text-gray-700"
                value={email}
                onChange={e => setEmail(e.target.value)}
              />
              <input
                type="password"
                placeholder="Senha"
                className="w-full border px-4 py-2 rounded text-gray-700"
                value={senha}
                onChange={e => setSenha(e.target.value)}
              />
              <button className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700 transition">
                Cadastrar
              </button>
              <p className="text-sm text-center text-green-700">
                Já tem conta?{' '}
                <button
                  type="button"
                  onClick={() => setIsCadastro(false)}
                  className="text-green-600 hover:underline"
                >
                  Entrar
                </button>
              </p>
            </motion.form>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  )
}
