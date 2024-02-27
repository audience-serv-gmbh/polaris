import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import * as dotenv from 'dotenv';
import { resolve } from 'path';
import { ExpressAdapter, NestExpressApplication } from '@nestjs/platform-express';
import helmet from 'helmet';
import * as cors from 'cors';
import * as morgan from 'morgan';
import {
  initializeTransactionalContext,
  patchTypeORMRepositoryWithBaseRepository,
} from 'typeorm-transactional-cls-hooked';
import { ClassSerializerInterceptor, Logger, ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { SharedModule } from './shared/shared.module';
import { ConfigService } from './shared/services/config.service';

dotenv.config({ path: resolve(__dirname, '../.env') });

async function bootstrap() {
  const logger = new Logger(AppModule.name);

  initializeTransactionalContext();
  patchTypeORMRepositoryWithBaseRepository();

  const app = await NestFactory.create<NestExpressApplication>(AppModule, new ExpressAdapter(), {
    cors: true,
  });

  app.setGlobalPrefix('api');
  app.use(
    helmet({
      crossOriginResourcePolicy: false,
    }),
  );
  app.use(cors('*'));
  // app.use(
  //   RateLimit({
  //     windowMs: 15 * 60 * 1000, // 15 minutes
  //     max: 100, // limit each IP to 100 requests per windowMs
  //   }),
  // );
  app.use(morgan('combined'));

  const reflector = app.get(Reflector);

  app.useGlobalInterceptors(new ClassSerializerInterceptor(reflector));
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      // dismissDefaultMessages: true,
      // validationError: {
      //   target: false,
      // },
    }),
  );

  const configService = app.select(SharedModule).get(ConfigService);
  const port = configService.getNumber('PORT');

  if (configService.nodeEnv === 'development') {
    const options = new DocumentBuilder()
      .addBearerAuth()
      .setTitle('Polaris')
      .setDescription('Polaris API documentation')
      .setVersion('1.0')
      .build();
    const document = SwaggerModule.createDocument(app, options);
    SwaggerModule.setup('api/docs', app, document);
    logger.log(`SWAGGER IS RUNNING ON http://localhost:${port}/api/docs`);
  }

  await app.listen(port || 3000);
  logger.log(`SERVER IS RUNNING ON http://localhost:${port}`);
}

void bootstrap();
