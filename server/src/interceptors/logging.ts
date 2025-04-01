import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common'
import { Observable, throwError } from 'rxjs'
import { catchError, tap } from 'rxjs/operators'
import chalk from 'chalk'

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest()
    const { method, url, body } = request
    const start = Date.now()

    return next.handle().pipe(
      tap(response => {
        const duration = Date.now() - start
        const timestamp = new Date().toISOString()

        console.log(
          chalk`{blue ${timestamp}} -> {yellow ${duration}ms} | [{green ${method}}] {cyan ${url}} {magenta ${JSON.stringify(
            body || {}
          )}} | {gray ${JSON.stringify(response)}}`
        )
      }),
      catchError(err => {
        const duration = Date.now() - start
        const timestamp = new Date().toISOString()

        console.error(
          chalk`{red ${timestamp}} -> {yellow ${duration}ms} | [{green ${method}}] {cyan ${url}} {magenta ${JSON.stringify(
            body || {}
          )}} | {red ${err.message}}`
        )

        return throwError(() => err)
      })
    )
  }
}
