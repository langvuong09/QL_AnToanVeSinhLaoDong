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
async function runSqlScript(dataSource, filePath) {
    const sql = (0, fs_1.readFileSync)(filePath, 'utf-8');
    const statements = sql
        .split(';')
        .map((statement) => statement.trim())
        .filter(Boolean);
    for (const statement of statements) {
        await dataSource.query(statement);
    }
}
async function seedSampleData(app) {
    const dataSource = app.get(typeorm_1.DataSource);
    try {
        const seedFiles = ['role.sql', 'doets.sql', 'user.sql', 'view.sql'];
        for (const fileName of seedFiles) {
            const filePath = (0, path_1.join)(__dirname, 'sql', fileName);
            if ((0, fs_1.existsSync)(filePath)) {
                common_1.Logger.log(`Seeding ${fileName}...`);
                await runSqlScript(dataSource, filePath);
            }
            else {
                common_1.Logger.warn(`Seed file not found: ${filePath}`);
            }
        }
        common_1.Logger.log('Sample data check & seeding completed');
    }
    catch (error) {
        common_1.Logger.error('Failed to seed sample data:', error);
    }
}
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    app.use((0, cookie_parser_1.default)());
    app.setGlobalPrefix('api/v1');
    app.enableCors({
        origin: '*',
        methods: ['GET', 'PUT', 'POST', 'PATCH', 'DELETE'],
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
    await seedSampleData(app);
    const port = process.env.VNA_PORT || 3000;
    common_1.Logger.log(`==== ${port} ====`);
    await app.listen(port, () => common_1.Logger.log(`==== BE listening on port ${port} ====`));
}
bootstrap();
//# sourceMappingURL=main.js.map