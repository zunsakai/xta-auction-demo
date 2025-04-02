import { useMutation } from '@tanstack/react-query'
import axios, { AxiosError } from 'axios'
import { ErrorResponse } from './interface'

interface RegisterCredentials {
  email: string
  password: string
}

interface RegisterResponse {
  token?: string
  user?: {
    id: string
    email: string
  }
  message?: string | string[]
  error?: string
  statusCode?: number
}

const register = async (credentials: RegisterCredentials): Promise<RegisterResponse> => {
  try {
    const response = await axios.post('http://localhost:8000/auth/register', credentials)
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

export const useRegister = () => {
  return useMutation({
    mutationFn: register,
    onError: (error: any) => {
      console.error('Register failed:', error)
    },
  })
}
