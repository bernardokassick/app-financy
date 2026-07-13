import { create } from "zustand"
import { persist } from "zustand/middleware"
import { apolloClient } from "../lib/graphql/apollo"
import { LOGIN_MUTATION, REGISTER_MUTATION } from "../lib/graphql/mutations/Auth"
import type { LoginInput, RegisterInput, User } from "../types"

type LoginMutationData = {
    login: {
        token: string
        refreshToken: string
        user: User
    }
}

type RegisterMutationData = {
    register: {
        token: string
        refreshToken: string
        user: User
    }
}

interface AuthState {
    user: User | null
    token: string | null
    isAuthenticated: boolean
    login: (variables: LoginInput) => Promise<boolean>
    signup: (variables: RegisterInput) => Promise<boolean>
    logout: () => void
    setUser: (user: User) => void
}

export const useAuthStore = create<AuthState>()(
    persist(
        (set) => ({
            user: null,
            token: null,
            isAuthenticated: false,

            login: async (loginData: LoginInput) => {
                try {
                    const { data } = await apolloClient.mutate<
                    LoginMutationData,
                    { data: LoginInput }
                    >({
                        mutation: LOGIN_MUTATION,
                        variables: {
                            data: {
                                email: loginData.email,
                                password: loginData.password
                            }
                        }
                    })   
                    
                    if (data?.login) {
                        const { user, token } = data.login

                        set({
                            user: {
                                id: user.id,
                                name: user.name,
                                email: user.email
                            },
                            token,
                            isAuthenticated: true
                        })                        

                        return true
                    }

                    return false
                } catch (error) {
                    console.error("Erro na tentativa de login:", error)
                    throw error
                }
            },

            signup: async (registerData: RegisterInput) => {
                try {
                    const { data } = await apolloClient.mutate<
                    RegisterMutationData,
                    { data: RegisterInput }
                    >({
                        mutation: REGISTER_MUTATION,
                        variables: {
                            data: {
                                name: registerData.name,
                                email: registerData.email,
                                password: registerData.password
                            }
                        }
                    })

                    if (data?.register) {
                        const { user, token } = data.register

                        set({
                            user: {
                                id: user.id,
                                name: user.name,
                                email: user.email,
                            },
                            token,
                            isAuthenticated: true
                        })

                        return true
                    }

                    return false
                } catch (error) {
                    console.error("Erro na tentativa de registro:", error)
                    throw error
                }                
            },

            setUser: (user: User) => {
                set({ user });
            },

            logout: () => {
                set({ user: null, token: null, isAuthenticated: false })
                apolloClient.clearStore()
            },
        }),
        {
            name: "@Financy:auth"
        }
    )
)