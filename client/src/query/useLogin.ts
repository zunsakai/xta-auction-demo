import { useMutation } from '@tanstack/react-query'
import axios, { AxiosError } from 'axios'
import { ErrorResponse } from './interface'

interface LoginCredentials {
  email: string
  password: string
}

interface LoginResponse {
  token?: string
  user?: {
    id: string
    email: string
  }
  message?: string | string[]
  error?: string
  statusCode?: number
}

const login = async (credentials: LoginCredentials): Promise<LoginResponse> => {
  try {
    const response = await axios.post('http://localhost:8000/auth/login', credentials)
    return response.data
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const axiosError = error as AxiosError<ErrorResponse>
      if (axiosError.response?.data) {
        throw axiosError.response.data
      }
    }
    throw error
  }
}

export const useLogin = () => {
  return useMutation({
    mutationFn: login,
    onError: (error: any) => {
      console.error('Login failed:', error)
    },
  })
}
