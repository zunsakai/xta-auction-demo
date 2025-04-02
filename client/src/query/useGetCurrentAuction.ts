import { useQuery } from '@tanstack/react-query'
import axios, { AxiosError } from 'axios'
import { ErrorResponse } from './interface'
import { useGetHistoryAuction } from './useGetHistoryAuction'

interface Auction {
  id: string
  startingPrice: number
  currentPrice: number
  minIncrement: number
  startTime: string
  endTime: string
  timeLeft: number
}

const getCurrentAuction = async (): Promise<Auction> => {
  try {
    const token = localStorage.getItem('accessToken')
    const config = token
      ? {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      : {}

    const response = await axios.get('http://localhost:8000/auction/current', config)
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

export const useGetCurrentAuction = (refetchInterval: number) => {
  const currentAuctionQuery = useQuery({
    queryKey: ['currentAuction'],
    queryFn: getCurrentAuction,
    gcTime: 0,
    refetchInterval,
    retry: 0,
  })

  const historyQuery = useGetHistoryAuction(currentAuctionQuery.data?.id || '')
  return {
    ...currentAuctionQuery,
    historyData: historyQuery.data,
    historyIsLoading: historyQuery.isLoading,
    historyError: historyQuery.error
  }
}
