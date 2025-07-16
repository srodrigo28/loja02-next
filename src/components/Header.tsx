'use client'

import { FC } from 'react'

type Props = {
  nome: string
  avatar_url?: string
  papel?: string
}

const Header: FC<Props> = ({ nome, avatar_url, papel }) => {
  return (
    <header className="flex items-center justify-between bg-white p-4 rounded-lg shadow mb-6">
      <div className="flex items-center gap-4">
        <img
          src={avatar_url || '/avatar-placeholder.png'}
          alt={nome}
          className="w-12 h-12 rounded-full object-cover border border-gray-300"
        />
        <div>
          <p className="font-bold text-lg text-gray-800">{nome}</p>
          {papel && (
            <p className="text-sm text-gray-500 capitalize">{papel}</p>
          )}
        </div>
      </div>

      {(papel === 'admin' || papel === 'superadmin') && (
        <a
          href="/admin"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 text-sm font-semibold"
        >
          Painel Admin
        </a>
      )}
    </header>
  )
}

export default Header
