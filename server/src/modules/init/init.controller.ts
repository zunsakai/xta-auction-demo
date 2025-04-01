import { Controller, Get, Scope } from '@nestjs/common'
import { Public } from '@app/decorators'

@Controller({ scope: Scope.REQUEST })
export class InitController {

  @Public()
  @Get('init')
  async helloworld() {
    return 'Hello World'
  }
}
