'use client'

import { useEffect, useState } from 'react'
import { PackageSearch, Star, ShoppingBag } from 'lucide-react'
import { supabase } from '@/lib/lib/supabaseClient'
import CardInfo from '@/components/CardInfo'
import Header from '@/components/Header'

interface Metrics {
  produtos: number
  avaliacoes: number
  vendidos: number
}

type Usuario = {
  nome: string
  avatar_url?: string
  papel?: string
}

export default function DashboardPage() {
  const [metrics, setMetrics] = useState<Metrics>({
    produtos: 0,
    avaliacoes: 0,
    vendidos: 0
  })

  const [usuario, setUsuario] = useState<Usuario>({
    nome: '',
    avatar_url: '',
    papel: ''
  })

  useEffect(() => {
    async function fetchDados() {
      const user = (await supabase.auth.getUser()).data.user
      if (!user) return

      // Busca dados do usuário na tabela "usuarios"
      const { data: dadosUsuario } = await supabase
        .from('usuarios')
        .select('nome, avatar_url, papel')
        .eq('user_id', user.id)
        .single()

      if (dadosUsuario) {
        setUsuario({
          nome: dadosUsuario.nome,
          avatar_url: dadosUsuario.avatar_url,
          papel: dadosUsuario.papel
        })
      }

      // Busca métricas
      const [prod, aval, vend] = await Promise.all([
        supabase
          .from('produtos')
          .select('id', { count: 'exact', head: true })
          .eq('user_id', user.id),
        supabase
          .from('avaliacoes')
          .select('id', { count: 'exact', head: true })
          .eq('usuario_id', user.id),
        supabase
          .from('itens_pedido')
          .select('quantidade', { count: 'exact', head: true })
          .eq('usuario_id', user.id) // ajuste aqui se necessário
      ])

      setMetrics({
        produtos: prod.count || 0,
        avaliacoes: aval.count || 0,
        vendidos: vend.count || 0
      })
    }

    fetchDados()
  }, [])

  return (
    <section className="max-w-full mx-auto px-4 py-8 bg-sky-200 min-h-screen">
      <Header
        nome={usuario.nome}
        avatar_url={usuario.avatar_url}
        papel={usuario.papel}
      />

       <div className="flex justify-between items-center mb-8">
      <h2 className="text-3xl font-bold text-white">
        📊 Informações Gerais
      </h2>
      <a
        href="/produtos/novo"
        className="bg-white text-blue-600 px-4 py-2 rounded-lg font-semibold shadow hover:bg-blue-100 transition"
      >
        ➕ Novo Produto
      </a>
    </div>

      <div className="grid gap-6 grid-cols-1 md:grid-cols-3">
        <CardInfo
          label="Produtos Cadastrados"
          valor={metrics.produtos}
          icone={PackageSearch}
        />
        <CardInfo
          label="Avaliações Feitas"
          valor={metrics.avaliacoes}
          icone={Star}
        />
        <CardInfo
          label="Produtos Vendidos"
          valor={metrics.vendidos}
          icone={ShoppingBag}
        />
      </div>
    </section>
  )
}