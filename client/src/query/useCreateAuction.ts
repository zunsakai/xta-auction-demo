import { useMutation } from '@tanstack/react-query'
import axios, { AxiosError } from 'axios'
import { ErrorResponse } from './interface'
import { queryClient } from './client'

interface CreateAuctionPayload {
  startingPrice: number
  minIncrement: number
}

interface AuctionResponse {
  _id: string
  startingPrice: number
  currentPrice: number
  minIncrement: number
  startTime: string
  endTime: string
  participants: any[]
  createdAt: string
  updatedAt: string
}

const createAuction = async (payload: CreateAuctionPayload): Promise<AuctionResponse> => {
  try {
    const token = localStorage.getItem('accessToken')
    const config = token
      ? {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      : {}

    const response = await axios.post('http://localhost:8000/auction', payload, config)
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

export const useCreateAuction = () => {
  return useMutation({
    mutationFn: createAuction,
    onSuccess: () => {
      // Invalidate and refetch current auction data when a new auction is created
      queryClient.invalidateQueries({ queryKey: ['currentAuction'] })
    },
  })
}
