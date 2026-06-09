import { ConfigService } from '@nestjs/config';
import { JwtModuleOptions } from '@nestjs/jwt';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
export declare const load: () => {
    isProduction: boolean;
    isDev: boolean;
    jwt: JwtModuleOptions;
    port: number;
    db: TypeOrmModuleOptions;
    s3: {
        accessKeyId: string | undefined;
        secretAccessKey: string | undefined;
        bucketName: string | undefined;
    };
};
export declare const dbOptions: (configService: ConfigService) => Promise<TypeOrmModuleOptions>;
export declare const jwtOptions: (configService: ConfigService) => Promise<JwtModuleOptions | undefined>;
