import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatNumber(num: number): string {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M'
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'K'
  }
  return num.toString()
}

export function generateGradient(direction: string = 'to-br'): string {
  const gradients = [
    `bg-gradient-${direction} from-blue-600 to-purple-600`,
    `bg-gradient-${direction} from-purple-600 to-pink-600`,
    `bg-gradient-${direction} from-green-600 to-blue-600`,
    `bg-gradient-${direction} from-orange-600 to-red-600`,
    `bg-gradient-${direction} from-indigo-600 to-purple-600`,
  ]
  return gradients[Math.floor(Math.random() * gradients.length)]
}
