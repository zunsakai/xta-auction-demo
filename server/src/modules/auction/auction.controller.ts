import { Body, Controller, Get, Param, Post } from '@nestjs/common'
import { AuctionService } from './auction.service'
import { CreateAuctionDto, PlaceBidDto } from './auction.dto'
import { CurrentUser } from '@app/decorators/current-user.decorator'
import { ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger'

@ApiTags('Auction')
@Controller('auction')
export class AuctionController {
  constructor(private readonly auctionService: AuctionService) {}

  @Post()
  createAuction(@Body() createAuctionDto: CreateAuctionDto) {
    return this.auctionService.createAuction(createAuctionDto)
  }

  @Get('current')
  @ApiOperation({ description: 'Get current auction' })
  getCurrentAuction() {
    return this.auctionService.getCurrentAuction()
  }

  @Post('bid')
  placeBid(@CurrentUser('sub') userId: string, @Body() placeBidDto: PlaceBidDto) {
    return this.auctionService.placeBid(userId, placeBidDto)
  }

  @Get('history/:auctionId')
  @ApiOperation({ description: 'Get bid history for a specific auction' })
  @ApiParam({ name: 'auctionId', description: 'Auction ID' })
  getAuctionHistory(@Param('auctionId') auctionId: string) {
    return this.auctionService.getAuctionHistory(auctionId)
  }
}
