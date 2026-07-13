export interface RegisterInput {
  name: string
  email: string
  password: string
}

export interface LoginInput {
  email: string
  password: string
}

export interface User {
    id: string
    name: string
    email: string
}

export interface Category {
    id: string
    name: string
    description: string
    color: string
    icon: string
    itemsCount: number
    totalValue: number
}

export interface Transaction {
    id: string
    description: string
    amount: number
    type: 'income' | 'outcome'
    date: string
    category: Category
}