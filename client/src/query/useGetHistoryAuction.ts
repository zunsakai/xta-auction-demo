import { useQuery } from '@tanstack/react-query'
import axios, { AxiosError } from 'axios'
import { ErrorResponse } from './interface'

interface Bid {
  id: string
  userId: string
  userEmail: string
  amount: number
  bidTime: string
}

interface AuctionHistory {
  auction: {
    id: string
    startingPrice: number
    currentPrice: number
    startTime: string
    endTime: string
    winner: string
  }
  bids: Bid[]
}

const getAuctionHistory = async (auctionId: string): Promise<AuctionHistory> => {
  try {
    const token = localStorage.getItem('accessToken')
    const config = token
      ? {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      : {}

    const response = await axios.get(`http://localhost:8000/auction/history/${auctionId}`, config)
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

export const useGetHistoryAuction = (auctionId: string) => {
  return useQuery({
    queryKey: ['auctionHistory', auctionId],
    queryFn: () => getAuctionHistory(auctionId),
    enabled: !!auctionId,
    gcTime: 0,
    refetchInterval: 10000,
    retry: 0,
  })
}
