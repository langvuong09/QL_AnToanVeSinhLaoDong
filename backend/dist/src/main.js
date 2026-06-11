"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const express_1 = require("express");
const fs_1 = require("fs");
const path_1 = require("path");
const typeorm_1 = require("typeorm");
const app_module_1 = require("./app.module");
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const http_exception_filter_1 = require("./commons/filters/http-exception.filter");
async function runSqlScript(dataSource, filePath) {
    const sql = (0, fs_1.readFileSync)(filePath, 'utf-8');
    const statements = sql.split(';').filter(s => s.trim().length > 0);
    for (const statement of statements) {
        try {
            await dataSource.query(statement);
        }
        catch (err) {
            common_1.Logger.debug(`Skipping statement: ${err.message}`);
        }
    }
    common_1.Logger.log(`Finished: ${filePath}`);
}
async function seedSampleData(app) {
    const dataSource = app.get(typeorm_1.DataSource);
    const sqlDir = (0, path_1.join)(process.cwd(), 'dist', 'src', 'sql');
    const seedFiles = [
        '00_industry_bussinessType.sql',
        '01_group-permissions.sql',
        '02_role.sql',
        '03_doets.sql',
        '04_permission.sql',
        '05_user.sql',
        '06_view.sql'
    ];
    for (const fileName of seedFiles) {
        const filePath = (0, path_1.join)(sqlDir, fileName);
        if ((0, fs_1.existsSync)(filePath)) {
            await runSqlScript(dataSource, filePath);
        }
        else {
            common_1.Logger.warn(`Không tìm thấy file: ${filePath}`);
        }
    }
}
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    app.use((0, cookie_parser_1.default)());
    app.useGlobalFilters(new http_exception_filter_1.AllExceptionsFilter());
    app.setGlobalPrefix('api/v1');
    app.enableCors({
        origin: '*',
        methods: ['GET', 'PUT', 'POST', 'PATCH', 'DELETE', 'OPTIONS'],
        allowedHeaders: [
            'Content-Type',
            'Authorization',
            'X-Requested-With',
            'Accept',
        ],
        credentials: true,
    });
    const config = new swagger_1.DocumentBuilder()
        .addBearerAuth({ in: 'header', type: 'http', bearerFormat: 'JWT' })
        .setTitle('VNA - Meritorious Person - API documentation')
        .setDescription('')
        .setVersion('1.0')
        .build();
    const document = swagger_1.SwaggerModule.createDocument(app, config);
    swagger_1.SwaggerModule.setup('api/v1/api-docs', app, document);
    app.use((0, express_1.json)({ limit: '50mb' }));
    app.use((0, express_1.urlencoded)({
        extended: true,
        limit: '50mb',
    }));
    app.useGlobalPipes(new common_1.ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
    }));
    await seedSampleData(app);
    const port = process.env.VNA_PORT || 3000;
    common_1.Logger.log(`==== ${port} ====`);
    await app.listen(port, () => common_1.Logger.log(`==== BE listening on port ${port} ====`));
}
bootstrap();
//# sourceMappingURL=main.js.map