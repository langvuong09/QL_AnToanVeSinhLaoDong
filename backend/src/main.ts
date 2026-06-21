import { NestFactory } from '@nestjs/core';
import { Logger, ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { json, urlencoded } from 'express';
import { existsSync, readFileSync } from 'fs';
import { join } from 'path';
import { DataSource } from 'typeorm';

import { AppModule } from './app.module';
import cookieParser from 'cookie-parser';
import { AllExceptionsFilter } from './commons/filters/http-exception.filter';

async function runSqlScript(dataSource: DataSource, filePath: string) {
  const sql = readFileSync(filePath, 'utf-8');
  // Chia nhỏ file theo dấu chấm phẩy
  const statements = sql.split(';').filter(s => s.trim().length > 0);

  for (const statement of statements) {
    try {
      await dataSource.query(statement);
    } catch (err: any) {
      // Nếu lỗi là do trùng lặp (ON CONFLICT), ta có thể bỏ qua log lỗi này
      Logger.warn(`SQL Error in ${filePath}: ${err.message}`);
    }
  }
  Logger.log(`Finished: ${filePath}`);
}

async function seedSampleData(app: any) {
  const dataSource = app.get(DataSource);
  
  // Đường dẫn khớp chính xác với Dockerfile của bạn: dist/src/sql
  const sqlDir = join(process.cwd(), 'dist', 'src', 'sql'); 

  // Đổi tên file theo prefix (01_, 02_...) để chắc chắn chạy đúng thứ tự
  const seedFiles = [
    '00_industry_bussinessType.sql',
    '01_group-permissions.sql',
    '02_role.sql', 
    '03_doets.sql',  
    '04_permission.sql',  
    '05_user.sql',              
    '06_view.sql',
    '07_trauma_injury.sql',           
  ];

  for (const fileName of seedFiles) {
    const filePath = join(sqlDir, fileName);
    if (existsSync(filePath)) {
      await runSqlScript(dataSource, filePath);
    } else {
      Logger.warn(`Không tìm thấy file: ${filePath}`);
    }
  }
}

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(cookieParser());
  app.useGlobalFilters(new AllExceptionsFilter());
  app.setGlobalPrefix('api/v1');
  app.enableCors({
    origin: 'http://localhost:3000',
    methods: ['GET', 'PUT', 'POST', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: [
      'Content-Type',
      'Authorization',
      'X-Requested-With',
      'Accept',
    ],
    credentials: true,
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

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  await seedSampleData(app);

  const port = process.env.VNA_PORT || 3000;
  Logger.log(`==== ${port} ====`);
  await app.listen(port, () =>
    Logger.log(`==== BE listening on port ${port} ====`),
  );
}
bootstrap();
