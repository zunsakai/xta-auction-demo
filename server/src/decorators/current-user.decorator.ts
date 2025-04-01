import { createParamDecorator, ExecutionContext } from '@nestjs/common'

/**
 * Get the current user from the request
 */
export const CurrentUser = createParamDecorator(
  (data: string | undefined, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest()
    if (data) {
      return request.user?.[data]
    }
    return request.user
  },
)
