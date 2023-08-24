import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();

  const config = new DocumentBuilder()
    .setTitle('PierTwo Staking Launchpad API')
    .setDescription('An API to serve information about PierTwo validators')
    .setVersion('1.0')
    .addTag('PierTwo')
    .addTag('Beaconchain')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('', app, document);

  await app.listen(8000);
}
bootstrap();
