import { join } from 'path'
import { INestApplication, ValidationPipe } from '@nestjs/common'
import * as httpContext from 'express-http-context'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'
import { config } from 'dotenv'
import { LoggingInterceptor } from '@app/interceptors'

// Load the global .env file
config({ path: join(__dirname, '../.env') })

export function initializeApp(app: INestApplication) {
  app.enableCors({ origin: '*' })
  app.use(httpContext.middleware)
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
    })
  )
  app.useGlobalInterceptors(new LoggingInterceptor())
  // any other global settings
}

export function initializeSwagger(app: INestApplication) {
  const config = new DocumentBuilder()
    .setTitle('XTA Auction Service')
    .setDescription('XTA Auction Service')
    .setVersion('1.0')
    .addBearerAuth()
    .addSecurityRequirements('bearer')
    .build()

  const document = SwaggerModule.createDocument(app, config)

  SwaggerModule.setup('/docs', app, document, {
    swaggerOptions: {
      persistAuthorization: true,
    },
  })
}
