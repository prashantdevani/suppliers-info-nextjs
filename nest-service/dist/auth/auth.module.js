"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthModule = void 0;
const common_1 = require("@nestjs/common");
const auth_service_1 = require("./auth.service");
const auth_controller_1 = require("./auth.controller");
const jwt_1 = require("@nestjs/jwt");
const config_1 = require("@nestjs/config");
const passport_1 = require("@nestjs/passport");
const config_module_1 = require("../config/config.module");
const user_module_1 = require("../user/user.module");
const database_module_1 = require("../database/database.module");
const token_module_1 = require("../token/token.module");
const kinesislogger_middleware_1 = require("../logger/kinesislogger.middleware");
const kinesis_logger_1 = require("../logger/kinesis.logger");
const kafka_module_1 = require("../kafka/kafka.module");
const healthcheck_controller_1 = require("../healthcheck/healthcheck.controller");
let AuthModule = exports.AuthModule = class AuthModule {
    configure(consumer) {
        consumer.apply(kinesislogger_middleware_1.KinesisLoggerMiddleware).forRoutes('*');
    }
};
exports.AuthModule = AuthModule = __decorate([
    (0, common_1.Module)({
        imports: [
            jwt_1.JwtModule.registerAsync({
                imports: [config_module_1.ConfigModule],
                useFactory: async (configService) => ({
                    secret: configService.get('JWT_SECRET_KEY'),
                    signOptions: {
                        expiresIn: configService.get('JWT_EXPIRATIION'),
                    },
                }),
                inject: [config_1.ConfigService],
            }),
            database_module_1.DatabaseModule,
            user_module_1.UserModule,
            token_module_1.TokenModule,
            passport_1.PassportModule,
            kafka_module_1.KafkaModule,
            config_module_1.ConfigModule,
        ],
        providers: [auth_service_1.AuthService, kinesis_logger_1.KinesisService],
        controllers: [auth_controller_1.AuthController, healthcheck_controller_1.HealthCheckController],
    })
], AuthModule);
//# sourceMappingURL=auth.module.js.map