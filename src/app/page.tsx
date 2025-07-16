'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import {  useState } from 'react'

const produtos = [
  {
    id: 1,
    nome: 'Camisa Estilosa',
    preco: 89.90,
    descricao: 'Camisa 100% algodão, super confortável.',
    imagem: 'https://m.media-amazon.com/images/I/511o8E0vJIL._AC_SX679_.jpg'
  },
  {
    id: 2,
    nome: 'Tênis Moderno',
    preco: 199.99,
    descricao: 'Tênis com design esportivo e casual.',
    imagem: 'https://imgnike-a.akamaihd.net/1300x1300/028980ILA1.jpg'
  },
  {
    id: 3,
    nome: 'Relógio Digital',
    preco: 299.90,
    descricao: 'Relógio com pulseira de silicone e cronômetro.',
    imagem: 'https://m.media-amazon.com/images/I/61W8p4m8qLL._AC_SX679_.jpg'
  }
]

export default function HomePage() {
  const [busca, setBusca] = useState('')

  const produtosFiltrados = produtos.filter(produto =>
    produto.nome.toLowerCase().includes(busca.toLowerCase())
  )

  // useEffect(() => {
  //   const session = supabase.auth.getSession()
  //   // Pode armazenar no Zustand/contexto se quiser
  // }, [])

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 font-sans text-gray-800">
      {/* MENU STICKY */}
      <header className="sticky top-0 z-50 bg-sky-100 shadow border-b">
        <div className="max-w-7xl mx-auto px-6 py-4 flex flex-col md:flex-row items-center justify-between gap-4">

          {/* Logo */}
          <div className="text-2xl font-extrabold text-blue-600 tracking-tight">
            Minha<span className="text-gray-900">Loja</span>
          </div>

          {/* Campo de busca */}
          <input
            type="text"
            placeholder="Buscar produtos..."
            value={busca}
            onChange={e => setBusca(e.target.value)}
            className="w-full md:w-[400px] px-4 py-2 border border-gray-300 rounded-lg shadow-sm text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-500 transition"
          />

          {/* Ações (login/cadastro) */}
          <div className="flex gap-3 items-center">
            <Link href="/login" passHref>
              <button className="text-blue-600 font-medium hover:underline transition">Login</button>
            </Link>
            <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 shadow-md transition">
              Cadastrar
            </button>
          </div>
        </div>
      </header>


      {/* CONTEÚDO */}
      <main className="flex-1 max-w-6xl mt-10 mx-auto p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {produtosFiltrados.map((produto, i) => (
          <motion.div
            key={produto.id}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-white rounded-xl h-[400px] shadow-md overflow-hidden transform transition-all 
    duration-300 ease-in-out hover:shadow-2xl hover:scale-[1.03] hover:-translate-y-1 flex flex-col"
          >
            <div className="relative w-full h-[280px]">
              <Image
                src={produto.imagem}
                alt={produto.nome}
                fill
                className="object-cover"
              />
            </div>

            <div className="p-3 flex flex-col gap-1 h-[120px]">
              <h2 className="text-base font-semibold text-gray-800 truncate">{produto.nome}</h2>
              <p className="text-blue-600 text-sm font-bold">R$ {produto.preco.toFixed(2)}</p>
              <p className="text-xs text-gray-500 line-clamp-2">{produto.descricao}</p>
            </div>
          </motion.div>

        ))}
      </main>

      {/* RODAPÉ */}
      <footer className="bg-white border-t mt-12 text-gray-600 text-sm">
        <div className="max-w-6xl mx-auto px-6 py-8 flex flex-col md:flex-row justify-between items-start gap-6">
          <div>
            <h3 className="text-blue-600 font-bold mb-2 text-lg">MinhaLoja</h3>
            <p className="text-gray-500">© {new Date().getFullYear()} MinhaLoja. Todos os direitos reservados.</p>
          </div>
          <div>
            <h4 className="font-semibold mb-2">Contatos</h4>
            <ul className="space-y-1">
              <li>Email: contato@minhaloja.com</li>
              <li>WhatsApp: (69) 99999-9999</li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-2">Redes Sociais</h4>
            <div className="flex gap-4">
              <a href="#" className="hover:text-blue-600">Instagram</a>
              <a href="#" className="hover:text-blue-600">Facebook</a>
              <a href="#" className="hover:text-blue-600">Twitter</a>
              <a href="/doc.html" target="_blank" rel="noopener noreferrer" className="hover:text-blue-600">Documentação</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
