import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { PrismaService } from './prisma.service';
import { ConfigService } from '@nestjs/config';

function checkEnvironment(configService: ConfigService) {
  const requiredEnvVars = [
    'ROOT_URL',
    'AUDIENCE',
    'AUTH0_URL',
    'PRIVATE_STRIPE_KEY',
    'DATABASE_URL'
  ];

  requiredEnvVars.forEach((envVar) => {
    if (!configService.get<string>(envVar)) {
      throw Error(`Undefined environment variable: ${envVar}`);
    }
  });
}

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  const configService = app.get<ConfigService>(ConfigService);
  checkEnvironment(configService);
  
  const prismaService = app.get(PrismaService);
  await prismaService.enableShutdownHooks(app)
  app.setGlobalPrefix("api");
  await app.listen(3000);
}
bootstrap();
