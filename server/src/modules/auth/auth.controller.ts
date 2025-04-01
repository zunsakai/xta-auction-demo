import { Body, Controller, Post } from '@nestjs/common'
import { AuthService } from './auth.service'
import { LoginDto, RegisterDto } from './auth.dto'
import { Public } from '@app/decorators'
import { ApiOperation } from '@nestjs/swagger'

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Public()
  @Post('register')
  @ApiOperation({ description: 'Register API' })
  register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto.email, registerDto.password)
  }

  @Public()
  @Post('login')
  @ApiOperation({ description: 'Login API' })
  login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto.email, loginDto.password)
  }
}
