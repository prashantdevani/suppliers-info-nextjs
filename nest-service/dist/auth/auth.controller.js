"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const common_1 = require("@nestjs/common");
const express_1 = require("express");
const auth_service_1 = require("./auth.service");
const auth_validator_1 = require("../validators/auth.validator");
const common_response_1 = require("../common/common.response");
const swagger_1 = require("@nestjs/swagger");
const kinesislogger_middleware_1 = require("../logger/kinesislogger.middleware");
const error_util_1 = require("src/util/error.util");
let AuthController = exports.AuthController = class AuthController {
    constructor(authService) {
        this.authService = authService;
    }
    async login(body, res) {
        const isValidReq = (0, auth_validator_1.validateSignInRequest)(body);
        if (isValidReq.valid) {
            const response = await this.authService.login(body.cred, body.password, body.isEmail, body.locationInfo, body.systemInfo);
            if ('code' in response) {
                const { code } = response;
                res.cookie('code', code, { httpOnly: true });
                return res
                    .status(response.errorCode ? common_1.HttpStatus.BAD_REQUEST : common_1.HttpStatus.OK)
                    .json(response);
            }
            else {
                return res.status(common_1.HttpStatus.UNAUTHORIZED).json(response);
            }
        }
        else {
            return res.status(common_1.HttpStatus.BAD_REQUEST).json((0, common_response_1.createFailureResponse)({
                message: `Invalid Request: ${isValidReq.errors}`,
            }, error_util_1.ErrorMessage.BAD_REQUEST));
        }
    }
    async verifyLogin(body, res) {
        const isValidReq = (0, auth_validator_1.validateVerifySignInRequest)(body);
        if (isValidReq.valid) {
            const response = await this.authService.verifyLogin(body.userId, body.otp, body.locationInfo, body.systemInfo);
            if ('code' in response) {
                const { code } = response;
                res.cookie('code', code, { httpOnly: true });
                return res
                    .status(response.errorCode ? common_1.HttpStatus.BAD_REQUEST : common_1.HttpStatus.OK)
                    .json(response);
            }
            else {
                return res.status(common_1.HttpStatus.UNAUTHORIZED).json(response);
            }
        }
        else {
            return res.status(common_1.HttpStatus.BAD_REQUEST).json((0, common_response_1.createFailureResponse)({
                message: `Invalid Request: ${isValidReq.errors}`,
            }, error_util_1.ErrorMessage.BAD_REQUEST));
        }
    }
    async validateToken(token, res) {
        if (!token) {
            return res
                .status(common_1.HttpStatus.UNAUTHORIZED)
                .json((0, common_response_1.createFailureResponse)({ message: 'Token not present' }, error_util_1.ErrorMessage.BAD_REQUEST));
        }
        const response = await this.authService.validateToken(token);
        if ('isValid' in response.data && !response.data.isValid) {
            return res.status(common_1.HttpStatus.UNAUTHORIZED).json({ ...response });
        }
        return res.status(common_1.HttpStatus.OK).json({ ...response });
    }
    async refreshToken(token, res) {
        if (!token) {
            return res
                .status(common_1.HttpStatus.UNAUTHORIZED)
                .json((0, common_response_1.createFailureResponse)({ message: 'Token not present' }, error_util_1.ErrorMessage.BAD_REQUEST));
        }
        const response = await this.authService.refreshToken(token);
        return res.status(common_1.HttpStatus.CREATED).json({ ...response });
    }
    async acceptTerms(body, res) {
        const isValidReq = (0, auth_validator_1.validateTermsRequest)(body);
        if (isValidReq.valid) {
            const response = await this.authService.acceptTermsAndCondition(body.userId, body.isAccepted);
            return res
                .status(response.success === false ? common_1.HttpStatus.BAD_REQUEST : common_1.HttpStatus.OK)
                .json({ ...response });
        }
        return res.status(common_1.HttpStatus.UNAUTHORIZED).json((0, common_response_1.createFailureResponse)({
            message: `Invalid Request: ${isValidReq.errors}`,
        }, error_util_1.ErrorMessage.BAD_REQUEST));
    }
    async approveUser(body, res) {
        const isValidReq = (0, auth_validator_1.validateApproveRequest)(body);
        if (isValidReq.valid) {
            const response = await this.authService.approveUser(body.userId, body.approverMail, body.access);
            return res
                .status(response.success === false ? common_1.HttpStatus.BAD_REQUEST : common_1.HttpStatus.OK)
                .json({ ...response });
        }
        return res.status(common_1.HttpStatus.UNAUTHORIZED).json((0, common_response_1.createFailureResponse)({
            message: `Invalid Request: ${isValidReq.errors}`,
        }, error_util_1.ErrorMessage.BAD_REQUEST));
    }
    async updateUser(body, res) {
        const isValidReq = (0, auth_validator_1.validateUpdateRequest)(body);
        if (isValidReq.valid) {
            const response = await this.authService.updateUser(body.userId, body.analystMail, body.access);
            return res
                .status(response.success === false ? common_1.HttpStatus.BAD_REQUEST : common_1.HttpStatus.OK)
                .json({ ...response });
        }
        return res.status(common_1.HttpStatus.UNAUTHORIZED).json((0, common_response_1.createFailureResponse)({
            message: `Invalid Request: ${isValidReq.errors}`,
        }, error_util_1.ErrorMessage.BAD_REQUEST));
    }
    async assignAnalyst(body, res) {
        const isValidReq = (0, auth_validator_1.validateAssignRequest)(body);
        if (isValidReq.valid) {
            const response = await this.authService.assignAnalyst(body);
            return res
                .status(response.success === false ? common_1.HttpStatus.BAD_REQUEST : common_1.HttpStatus.OK)
                .json({ ...response });
        }
        return res.status(common_1.HttpStatus.UNAUTHORIZED).json((0, common_response_1.createFailureResponse)({
            message: `Invalid Request: ${isValidReq.errors}`,
        }, error_util_1.ErrorMessage.BAD_REQUEST));
    }
    async getUser(id, res) {
        if (!id) {
            return res
                .status(common_1.HttpStatus.UNAUTHORIZED)
                .json((0, common_response_1.createFailureResponse)({ message: 'id not present' }, error_util_1.ErrorMessage.BAD_REQUEST));
        }
        const response = await this.authService.getUser(id);
        return res
            .status(response.success === false ? common_1.HttpStatus.BAD_REQUEST : common_1.HttpStatus.OK)
            .json({ ...response });
    }
    async getUserLogin(id, res) {
        if (!id) {
            return res
                .status(common_1.HttpStatus.UNAUTHORIZED)
                .json((0, common_response_1.createFailureResponse)({ message: 'id not present' }, error_util_1.ErrorMessage.BAD_REQUEST));
        }
        const response = await this.authService.getUserLogin(id);
        return res
            .status(response.success === false ? common_1.HttpStatus.BAD_REQUEST : common_1.HttpStatus.OK)
            .json({ ...response });
    }
    async evaluateUser(body, res) {
        const isValidReq = (0, auth_validator_1.validateEvaluateRequest)(body);
        if (!isValidReq.valid) {
            return res
                .status(common_1.HttpStatus.UNAUTHORIZED)
                .json((0, common_response_1.createFailureResponse)({ message: 'id not present' }, error_util_1.ErrorMessage.BAD_REQUEST));
        }
        const response = await this.authService.evaluateUserAccess(body);
        return res
            .status(response.success === false ? common_1.HttpStatus.BAD_REQUEST : common_1.HttpStatus.OK)
            .json({ ...response });
    }
};
__decorate([
    (0, swagger_1.ApiTags)('Authentication'),
    (0, swagger_1.ApiOperation)({ summary: 'User Login' }),
    (0, common_1.Post)('login'),
    (0, common_1.UseInterceptors)(kinesislogger_middleware_1.KinesisLoggerMiddleware),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_a = typeof auth_validator_1.SignInRequest !== "undefined" && auth_validator_1.SignInRequest) === "function" ? _a : Object, typeof (_b = typeof express_1.Response !== "undefined" && express_1.Response) === "function" ? _b : Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "login", null);
__decorate([
    (0, swagger_1.ApiTags)('Authentication'),
    (0, swagger_1.ApiOperation)({ summary: 'User Login' }),
    (0, common_1.Post)('verify-login'),
    (0, common_1.UseInterceptors)(kinesislogger_middleware_1.KinesisLoggerMiddleware),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_c = typeof auth_validator_1.VerifySignInRequest !== "undefined" && auth_validator_1.VerifySignInRequest) === "function" ? _c : Object, typeof (_d = typeof express_1.Response !== "undefined" && express_1.Response) === "function" ? _d : Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "verifyLogin", null);
__decorate([
    (0, swagger_1.ApiTags)('Autharization'),
    (0, swagger_1.ApiOperation)({ summary: 'Authorizes the API with a Bearer token' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized' }),
    (0, common_1.Get)('validate-token'),
    (0, common_1.UseInterceptors)(kinesislogger_middleware_1.KinesisLoggerMiddleware),
    __param(0, (0, common_1.Headers)('token')),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, typeof (_e = typeof express_1.Response !== "undefined" && express_1.Response) === "function" ? _e : Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "validateToken", null);
__decorate([
    (0, swagger_1.ApiTags)('RefreshToken'),
    (0, swagger_1.ApiOperation)({ summary: 'Validate refresh token' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized' }),
    (0, common_1.Get)('refresh-token'),
    (0, common_1.UseInterceptors)(kinesislogger_middleware_1.KinesisLoggerMiddleware),
    __param(0, (0, common_1.Headers)('token')),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, typeof (_f = typeof express_1.Response !== "undefined" && express_1.Response) === "function" ? _f : Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "refreshToken", null);
__decorate([
    (0, swagger_1.ApiTags)('Accept-Terms'),
    (0, swagger_1.ApiOperation)({ summary: 'Accept terms info' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized' }),
    (0, common_1.Post)('terms'),
    (0, common_1.UseInterceptors)(kinesislogger_middleware_1.KinesisLoggerMiddleware),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_g = typeof auth_validator_1.TermsRequest !== "undefined" && auth_validator_1.TermsRequest) === "function" ? _g : Object, typeof (_h = typeof express_1.Response !== "undefined" && express_1.Response) === "function" ? _h : Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "acceptTerms", null);
__decorate([
    (0, swagger_1.ApiTags)('Approve User'),
    (0, swagger_1.ApiOperation)({ summary: 'Approve User' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized' }),
    (0, common_1.Post)('approve'),
    (0, common_1.UseInterceptors)(kinesislogger_middleware_1.KinesisLoggerMiddleware),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_j = typeof auth_validator_1.ApproveRequest !== "undefined" && auth_validator_1.ApproveRequest) === "function" ? _j : Object, typeof (_k = typeof express_1.Response !== "undefined" && express_1.Response) === "function" ? _k : Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "approveUser", null);
__decorate([
    (0, swagger_1.ApiTags)('Update Access'),
    (0, swagger_1.ApiOperation)({ summary: 'Update User' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized' }),
    (0, common_1.Post)('update'),
    (0, common_1.UseInterceptors)(kinesislogger_middleware_1.KinesisLoggerMiddleware),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_l = typeof auth_validator_1.UpdateRequest !== "undefined" && auth_validator_1.UpdateRequest) === "function" ? _l : Object, typeof (_m = typeof express_1.Response !== "undefined" && express_1.Response) === "function" ? _m : Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "updateUser", null);
__decorate([
    (0, swagger_1.ApiTags)('Assign Analyst'),
    (0, swagger_1.ApiOperation)({ summary: 'Assign Analyst' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized' }),
    (0, common_1.Post)('assign-analyst'),
    (0, common_1.UseInterceptors)(kinesislogger_middleware_1.KinesisLoggerMiddleware),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_o = typeof auth_validator_1.AssignAnalystRequest !== "undefined" && auth_validator_1.AssignAnalystRequest) === "function" ? _o : Object, typeof (_p = typeof express_1.Response !== "undefined" && express_1.Response) === "function" ? _p : Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "assignAnalyst", null);
__decorate([
    (0, swagger_1.ApiTags)('Get-User'),
    (0, swagger_1.ApiOperation)({ summary: 'Get user info' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized' }),
    (0, common_1.Get)('user'),
    (0, common_1.UseInterceptors)(kinesislogger_middleware_1.KinesisLoggerMiddleware),
    __param(0, (0, common_1.Query)('id')),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, typeof (_q = typeof express_1.Response !== "undefined" && express_1.Response) === "function" ? _q : Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "getUser", null);
__decorate([
    (0, swagger_1.ApiTags)('Get-User'),
    (0, swagger_1.ApiOperation)({ summary: 'Get user info' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized' }),
    (0, common_1.Get)('user-login'),
    (0, common_1.UseInterceptors)(kinesislogger_middleware_1.KinesisLoggerMiddleware),
    __param(0, (0, common_1.Query)('id')),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, typeof (_r = typeof express_1.Response !== "undefined" && express_1.Response) === "function" ? _r : Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "getUserLogin", null);
__decorate([
    (0, swagger_1.ApiTags)('Evaluate-User'),
    (0, swagger_1.ApiOperation)({ summary: 'Get user info' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized' }),
    (0, common_1.Post)('evaluate'),
    (0, common_1.UseInterceptors)(kinesislogger_middleware_1.KinesisLoggerMiddleware),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_s = typeof auth_validator_1.EvaluateUserRequest !== "undefined" && auth_validator_1.EvaluateUserRequest) === "function" ? _s : Object, typeof (_t = typeof express_1.Response !== "undefined" && express_1.Response) === "function" ? _t : Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "evaluateUser", null);
exports.AuthController = AuthController = __decorate([
    (0, common_1.Controller)('api/v1/auth'),
    __metadata("design:paramtypes", [auth_service_1.AuthService])
], AuthController);
//# sourceMappingURL=auth.controller.js.map