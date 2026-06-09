"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.jwtOptions = exports.dbOptions = exports.load = void 0;
const path_1 = require("path");
const load = () => {
    const env = process.env;
    const port = env.VNA_PORT ? parseInt(env.VNA_PORT, 10) : 3010;
    const dbConfig = {
        host: env.VNA_DB_HOST,
        port: parseInt(env.VNA_DB_PORT || '5432', 10),
        username: env.VNA_DB_USER,
        password: env.VNA_DB_PASSWORD,
        database: env.VNA_DB_DATABASE,
    };
    return {
        isProduction: env.NODE_ENV === 'production',
        isDev: env.NODE_ENV === 'development',
        jwt: {
            secret: env.VNA_TOKEN_SECRET_KEY,
            signOptions: { expiresIn: '60d' },
        },
        port,
        db: {
            ...dbConfig,
            type: 'postgres',
            charset: 'utf8_general_ci',
            synchronize: true,
            logging: true,
            keepConnectionAlive: true,
            migrationsTableName: 'migration_typeorm',
            migrationsRun: true,
            autoLoadEntities: true,
            bigNumberStrings: false,
            entities: [(0, path_1.join)(__dirname, './**/*.entity{.ts,.js}')],
            migrations: [(0, path_1.join)(__dirname, './migrations/*{.ts,.js}')],
        },
        s3: {
            accessKeyId: env.VNA_S3_ACCESS_ID,
            secretAccessKey: env.VNA_S3_ACCESS_KEY,
            bucketName: env.VNA_S3_BUCKET,
        },
    };
};
exports.load = load;
const dbOptions = async (configService) => configService.get('db');
exports.dbOptions = dbOptions;
const jwtOptions = async (configService) => configService.get('jwt');
exports.jwtOptions = jwtOptions;
//# sourceMappingURL=config.js.map