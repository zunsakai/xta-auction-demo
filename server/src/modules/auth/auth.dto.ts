import { ApiProperty } from '@nestjs/swagger'
import { IsEmail, IsNotEmpty, MinLength } from 'class-validator'
import { Transform } from 'class-transformer'

export class RegisterDto {
  @ApiProperty({ required: true, type: String, example: 'admin@xta.com' })
  @Transform(({ value }) => value?.trim())
  @IsNotEmpty({ message: 'Email is required' })
  @IsEmail({}, { message: 'Please provide a valid email address' })
  email: string

  @ApiProperty({ required: true, type: String, example: '123456' })
  @Transform(({ value }) => value?.trim())
  @IsNotEmpty({ message: 'Password is required' })
  @MinLength(6)
  password: string
}

export class LoginDto {
  @ApiProperty({ required: true, type: String, example: 'admin@xta.com' })
  @Transform(({ value }) => value?.trim())
  @IsNotEmpty({ message: 'Email is required' })
  @IsEmail({}, { message: 'Please provide a valid email address' })
  email: string

  @ApiProperty({ required: true, type: String, example: '123456' })
  @Transform(({ value }) => value?.trim())
  @IsNotEmpty({ message: 'Password is required' })
  @MinLength(6)
  password: string
}
