import { NestFactory } from '@nestjs/core';
import { Logger, ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { json, urlencoded } from 'express';
import { existsSync, readFileSync } from 'fs';
import { join } from 'path';
import { DataSource } from 'typeorm';

import { AppModule } from './app.module';

async function runSqlScript(dataSource: DataSource, filePath: string) {
  const sql = readFileSync(filePath, 'utf-8');
  const statements = sql
    .split(';')
    .map((statement) => statement.trim())
    .filter(Boolean);

  for (const statement of statements) {
    await dataSource.query(statement);
  }
}

async function seedSampleData(app: any) {
  const dataSource = app.get(DataSource);

  try {
    const seedFiles = ['role.sql', 'doets.sql', 'user.sql', 'view.sql'];
    
    for (const fileName of seedFiles) {
      const filePath = join(__dirname, 'sql', fileName);
      if (existsSync(filePath)) {
        Logger.log(`Seeding ${fileName}...`);
        await runSqlScript(dataSource, filePath);
      } else {
        Logger.warn(`Seed file not found: ${filePath}`);
      }
    }

    Logger.log('Sample data check & seeding completed');
  } catch (error) {
    Logger.error('Failed to seed sample data:', error);
  }
}


async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api/v1');
  app.enableCors({
    origin: '*',
    methods: ['GET', 'PUT', 'POST', 'PATCH', 'DELETE'],
  });
  const config = new DocumentBuilder()
    .addBearerAuth({ in: 'header', type: 'http', bearerFormat: 'JWT' })
    .setTitle('VNA - Meritorious Person - API documentation')
    .setDescription('')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/v1/api-docs', app, document);

  app.use(json({ limit: '50mb' }));
  app.use(
    urlencoded({
      extended: true,
      limit: '50mb',
    }),
  );

  // app.useGlobalPipes(new ValidationPipe());

  await seedSampleData(app);

  const port = process.env.VNA_PORT || 3000;
  Logger.log(`==== ${port} ====`);
  await app.listen(port, () =>
    Logger.log(`==== BE listening on port ${port} ====`),
  );
}
bootstrap();