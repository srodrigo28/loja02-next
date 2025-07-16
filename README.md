#### Previews telas
* > Home
<img src="./preview/home.png" alt="">

* > Dashboard
<img src="./preview/dashboard.png" alt="">

* > Doc
<img src="./preview/doc.png" alt="">

#### prompt home
```
preciso de uma tela inicial para um loja online usando as tecnologias.
next, typescript, tailwindcss, motion para animação,
lembrando quero somente a tela home page.tsx
precisa ter um header bonito com a opção de login ou cadastro do lado direito, logo do lado esquerdo, e no meio uma barra de pesquisa.
em baixo uma lista de cards com todos os produtos cadastrados, me traga inicialmente, um array para posteriormente nos trocarmos pelo os dados do banco.
nos cards, foto do produto, do lado nome, valor,  descrição a baixo,
para finalizar a me um footer escuro com algumas informais redes sócias etc.
```

####
```
npm i framer-motion
```

```
npm install @supabase/supabase-js
```

#### Env.
```
https://qlmmdhklaqyxpdctykjk.supabase.co
```

```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFsbW1kaGtsYXF5eHBkY3R5a2prIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDg2MzMxNzEsImV4cCI6MjA2NDIwOTE3MX0.EZyjWN4QT-Yf5f46dUKSE-sfQoWMIXtIAQPsekQvqzA
```

#### Contexto
```
npm i zustand
```

#### Links uteis
* modelos de telas
```
https://nicepage.com/pt/k/perfil-modelos-html
```

#### JWT Aut
```
✅ Solução: Sessão persistente por 24h com Supabase
O Supabase já suporta persistência de sessão via cookies ou localStorage, mas por padrão a sessão expira após 1 hora. Para manter o usuário logado por 24h (ou mais), precisamos:

🧠 Etapa 1: Configurar persistência de sessão
No seu client Supabase (ex: lib/supabaseClient.ts), garanta que a persistência esteja ativada corretamente:

ts
Copiar
Editar
import { createBrowserClient } from '@supabase/ssr'

export const supabase = createBrowserClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  {
    auth: {
      persistSession: true, // ✅ garante persistência no localStorage
      autoRefreshToken: true // ✅ renova automaticamente
    }
  }
)
🧠 Etapa 2: Configurar duração do token no Supabase Dashboard
Vá para o Supabase Dashboard

Clique em Authentication > Settings > Policies

Em JWT Expiry, defina 86400 segundos (24h)

Clique em Save

🧠 Etapa 3: Atualizar session manualmente (opcional)
Se ainda estiver enfrentando logout, você pode recuperar a sessão no useEffect global do app:

ts
Copiar
Editar
useEffect(() => {
  const session = supabase.auth.getSession()
  // pode armazenar no Zustand/contexto se quiser
}, [])
✨ Resultado
Com isso:

O usuário fica logado por 24h

A sessão é renovada automaticamente

O login não precisa ser repetido toda hora

Se quiser ainda mais durabilidade (ex: 7 dias), é só ajustar o JWT expiry.
```