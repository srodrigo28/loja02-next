import { supabase } from "./lib/supabaseClient"

export async function getTotaisPorUsuario(userId: string) {
  const [produtos, avaliacoes, vendidos] = await Promise.all([
    supabase.from('vw_total_produtos_por_usuario').select('total_produtos').eq('user_id', userId).single(),
    supabase.from('vw_total_avaliacoes_por_usuario').select('total_avaliacoes').eq('user_id', userId).single(),
    supabase.from('vw_total_produtos_vendidos_por_usuario').select('total_vendidos').eq('user_id', userId).single(),
  ])

  return {
    totalProdutos: produtos.data?.total_produtos || 0,
    totalAvaliacoes: avaliacoes.data?.total_avaliacoes || 0,
    totalVendidos: vendidos.data?.total_vendidos || 0,
  }
}
