import { supabase } from './lib/supabaseClient'
import { PostgrestError } from '@supabase/supabase-js'

// (Opcional) tipagem do retorno da tabela 'usuarios'
interface usuarios {
  id: number
  nome: string
  // adicione outros campos da tabela aqui, se necessário
}

export async function healthCheckSupabase(): Promise<boolean> {
  try {
    const { data, error }: { data: usuarios[] | null; error: PostgrestError | null } =
      await supabase.from('usuarios').select('*').limit(1)

    if (error) {
      console.error('🛑 Falha ao acessar a tabela "usuarios":', error.message)
      return false
    }

    console.log('✅ Supabase conectado e tabela "usuarios" acessível.', data)
    return true
  } catch (err: unknown) {
    const error = err as Error
    console.error('❌ Erro inesperado durante verificação Supabase:', error.message || err)
    return false
  }
}
