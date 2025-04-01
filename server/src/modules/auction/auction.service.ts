import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common'
import { AuctionRepository, BidRepository } from '@app/modules/systems.mongodb/repositories'
import { CreateAuctionDto, PlaceBidDto } from './auction.dto'
import { hideEmail, vndFormat } from '@app/utils'

@Injectable()
export class AuctionService {
  constructor(
    private readonly auctionRepository: AuctionRepository,
    private readonly bidRepository: BidRepository
  ) {}

  async createAuction(createAuctionDto: CreateAuctionDto) {
    const currentAuction = await this.auctionRepository.findOne({
      endTime: { $gt: new Date() },
    })

    if (currentAuction) {
      throw new BadRequestException('There is already an active auction.')
    }

    const startTime = new Date()
    const endTime = new Date(startTime.getTime() + 3 * 60 * 1000) // 3 minutes

    return this.auctionRepository.create({
      ...createAuctionDto,
      startTime,
      endTime,
      currentPrice: createAuctionDto.startingPrice,
    })
  }

  async getCurrentAuction() {
    const auction = await this.auctionRepository.findOne({
      endTime: { $gt: new Date() },
    })

    if (!auction) {
      throw new NotFoundException('No active auction found')
    }

    return {
      id: auction._id,
      startingPrice: auction.startingPrice,
      currentPrice: auction.currentPrice,
      minIncrement: auction.minIncrement,
      startTime: auction.startTime,
      endTime: auction.endTime,
      timeLeft: Math.max(0, auction.endTime.getTime() - new Date().getTime()) / 1000, // seconds remaining
      currentWinner: auction.currentWinner,
    }
  }

  async placeBid(userId: string, placeBidDto: PlaceBidDto) {
    const auction = await this.auctionRepository.findOneById(placeBidDto.auctionId)

    if (!auction) {
      throw new NotFoundException('Auction not found')
    }

    if (auction.endTime < new Date()) {
      throw new BadRequestException('Auction has ended')
    }

    if (placeBidDto.amount <= auction.currentPrice) {
      throw new BadRequestException('Bid must be higher than current price')
    }

    if ((placeBidDto.amount - auction.currentPrice) % auction.minIncrement !== 0) {
      throw new BadRequestException(`Bid must be in increments of ${vndFormat(auction.minIncrement * Math.pow(10, 6))}`)
    }

    // Update auction with new bid
    const updatedAuction = await this.auctionRepository.findOneAndUpdate(
      { _id: placeBidDto.auctionId },
      {
        currentPrice: placeBidDto.amount,
        currentWinner: userId,
        $addToSet: { participants: userId },
      },
      { new: true }
    )

    // Save bid history
    await this.bidRepository.create({
      auctionId: placeBidDto.auctionId,
      userId,
      amount: placeBidDto.amount,
      bidTime: new Date(),
    })

    return {
      id: updatedAuction._id,
      currentPrice: updatedAuction.currentPrice,
      timeLeft: Math.max(0, updatedAuction.endTime.getTime() - new Date().getTime()) / 1000,
      isWinning: updatedAuction.currentWinner.toString() === userId,
    }
  }

  async getAuctionHistory(auctionId: string) {
    const auction = await this.auctionRepository.findOneById(auctionId)
    if (!auction) {
      throw new NotFoundException('Auction not found')
    }

    const bids = await this.bidRepository.find(
      { auctionId },
      {
        populate: {
          path: 'userId',
          select: 'email',
        },
        sort: { bidTime: -1 },
      }
    )

    return {
      auction: {
        id: auction._id,
        startingPrice: auction.startingPrice,
        currentPrice: auction.currentPrice,
        startTime: auction.startTime,
        endTime: auction.endTime,
        winner: auction.currentWinner,
      },
      bids: bids.map((bid: any) => ({
        id: bid._id,
        userId: bid.userId._id,
        userEmail: hideEmail(bid.userId.email),
        amount: bid.amount,
        bidTime: bid.bidTime,
      })),
    }
  }
}
