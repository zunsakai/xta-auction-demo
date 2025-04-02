import { IsMongoId, IsNotEmpty, IsNumber, Min } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'

export class CreateAuctionDto {
  @ApiProperty({ required: true, type: Number, example: 50 })
  @IsNotEmpty()
  @IsNumber()
  @Min(50, { message: 'Starting price must not be less than 50.000.000 ₫' })
  startingPrice: number = 50

  @ApiProperty({ required: true, type: Number, example: 5 })
  @IsNotEmpty()
  @IsNumber()
  @Min(5, { message: 'Min increment must not be less than 5.000.000 ₫' })
  minIncrement: number = 5
}

export class PlaceBidDto {
  @ApiProperty({ required: true, })
  @IsNotEmpty()
  @IsMongoId()
  auctionId: string

  @ApiProperty({ required: true, type: Number })
  @IsNotEmpty()
  @IsNumber()
  @Min(0, { message: 'Amount must not be less than 0' })
  amount: number
}
