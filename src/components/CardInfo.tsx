'use client'

import { FC } from 'react'
import { LucideIcon } from 'lucide-react'

interface CardInfoProps {
  label: string
  valor: number | string
  icone: LucideIcon
}

const CardInfo: FC<CardInfoProps> = ({ label, valor, icone: Icon }) => {
  return (
    <div className="bg-sky-300 rounded-xl shadow-md p-6 flex items-center space-x-4 hover:shadow-lg transition-shadow duration-300">
      <div className="bg-green-100 p-3 rounded-full">
        <Icon className="w-6 h-6 text-green-600" />
      </div>
      <div>
        <p className="text-sm text-gray-500">{label}</p>
        <p className="text-xl font-bold text-gray-800">{valor}</p>
      </div>
    </div>
  )
}

export default CardInfo
