import { useMutation } from '@tanstack/react-query'
import axios, { AxiosError } from 'axios'
import { ErrorResponse } from './interface'
import { queryClient } from './client'

interface BidPayload {
  auctionId: string
  amount: number
}

export interface BidResponse {
  id: string
  currentPrice: number
  timeLeft: number
  isWinning: boolean
}

const placeBid = async (payload: BidPayload): Promise<BidResponse> => {
  try {
    const token = localStorage.getItem('accessToken')
    const config = token
      ? {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      : {}

    const response = await axios.post('http://localhost:8000/auction/bid', payload, config)
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

export const useBid = () => {
  return useMutation({
    mutationFn: placeBid,
    onSuccess: (data) => {
      // Invalidate and refetch current auction data after successful bid
      queryClient.invalidateQueries({ queryKey: ['currentAuction'] })

      // Also invalidate and refetch auction history
      queryClient.invalidateQueries({
        queryKey: ['auctionHistory', data.id]
      })
    },
  })
}
