import { Injectable, ConflictException, UnauthorizedException } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import * as bcrypt from 'bcrypt'
import { UsersRepository } from '@app/modules/systems.mongodb/repositories'

@Injectable()
export class AuthService {
  constructor(
    private usersRepository: UsersRepository,
    private jwtService: JwtService
  ) {}

  async register(email: string, password: string) {
    // Check if user already exists
    const existingUser = await this.usersRepository.findOne({ email })
    if (existingUser) {
      throw new ConflictException('Email already registered')
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10)

    // Create new user
    const user = await this.usersRepository.create({
      email,
      password: hashedPassword,
    })

    const userId = user._id.toString()
    const token = this.generateToken(userId)

    return { user: { id: userId, email: user.email }, token }
  }

  async login(email: string, password: string) {
    const user = await this.usersRepository.findOne({ email })
    if (!user) {
      throw new UnauthorizedException('Invalid credentials')
    }

    const isPasswordValid = await bcrypt.compare(password, user.password)
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials')
    }

    const userId = user._id.toString()
    const token = this.generateToken(userId)

    return { user: { id: userId, email: user.email }, token }
  }

  private generateToken(userId: string) {
    return this.jwtService.sign({ sub: userId })
  }
}
