import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { initializeApp, initializeSwagger } from './initialize'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)
  initializeApp(app)
  initializeSwagger(app)
  await app.listen(8000)
}
bootstrap()
