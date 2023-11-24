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
var _a, _b, _c;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const config_1 = require("@nestjs/config");
const mongoose_1 = require("@nestjs/mongoose");
const user_schema_1 = require("../user/user.schema");
const mongoose_2 = require("mongoose");
const password_util_1 = require("../util/password.util");
const token_schema_1 = require("../token/token.schema");
const uuid_1 = require("uuid");
const common_response_1 = require("../common/common.response");
const kinesis_logger_1 = require("../logger/kinesis.logger");
const error_util_1 = require("../util/error.util");
const request_utils_1 = require("../util/request.utils");
let AuthService = exports.AuthService = class AuthService {
    constructor(jwtService, configService, kinesisService, userModel, tokenModel) {
        this.jwtService = jwtService;
        this.configService = configService;
        this.kinesisService = kinesisService;
        this.userModel = userModel;
        this.tokenModel = tokenModel;
    }
    async login(cred, passsword, isEmail, locationInfo, systemInfo) {
        try {
            const investorUrl = this.configService.get('INVESTOR_URL');
            let user = await this.userModel.findOne({ email: cred }).exec();
            let response = {};
            if (isEmail === false || isEmail === 'false') {
                user = await this.userModel.findOne({ mobile: cred }).exec();
            }
            if (user === null) {
                response.errorCode = error_util_1.ErrorMessage.USER_NOT_FOUND;
            }
            else {
                if ((0, password_util_1.shaEncrypt)(passsword) === user.password) {
                    if (!user.accountStatus) {
                        const code = (0, uuid_1.v4)();
                        await this.tokenModel.create({
                            userId: user._id,
                            code: code,
                            locationInfo: locationInfo,
                            systemInfo: systemInfo,
                            purpose: token_schema_1.Purpose.SIGN_IN,
                        });
                        if (!user.isEmailVerified) {
                            response.redirectUrl = `/signup/${user.userRole.toLocaleLowerCase()}/email/verify?id=${user._id}`;
                            if (user.userRole === user_schema_1.UserRole.INSTITUTIONAL_INVESTOR) {
                                response.redirectUrl = `/signup/corporate-client/email/verify?id=${user._id}`;
                            }
                        }
                        if (user.isEmailVerified && !user.isMobileVerified) {
                            response.redirectUrl = `/signup/${user.userRole.toLocaleLowerCase()}/phone?id=${user._id}`;
                            if (user.userRole === user_schema_1.UserRole.INSTITUTIONAL_INVESTOR) {
                                response.redirectUrl = `/signup/corporate-client/phone?id=${user._id}`;
                            }
                        }
                        if (user.isMobileVerified && user.isEmailVerified) {
                            if (user.isTermsAccepted) {
                                switch (user.userRole) {
                                    case user_schema_1.UserRole.INVESTOR:
                                        response.redirectUrl = `/signup/${user.userRole.toLocaleLowerCase()}/info/basic?id=${user._id}`;
                                        break;
                                    case user_schema_1.UserRole.FUND:
                                        response.redirectUrl = `/signup/${user.userRole.toLocaleLowerCase()}/info/primary?id=${user._id}`;
                                        break;
                                    case user_schema_1.UserRole.COMPANY:
                                        response.redirectUrl = `/signup/${user.userRole.toLocaleLowerCase()}/info/primary?id=${user._id}`;
                                        break;
                                    case user_schema_1.UserRole.INSTITUTIONAL_INVESTOR:
                                        response.redirectUrl = `/signup/corporate-client/info/primary?id=${user._id}`;
                                        break;
                                }
                            }
                            else {
                                response.redirectUrl = `/signup/${user.userRole.toLocaleLowerCase()}/info/terms?id=${user._id}`;
                                if (user.userRole === user_schema_1.UserRole.INSTITUTIONAL_INVESTOR) {
                                    response.redirectUrl = `/signup/corporate-client/info/terms?id=${user._id}`;
                                }
                            }
                        }
                        response.requireVerification = false;
                        response.code = code;
                    }
                    if (user.accountStatus === user_schema_1.Status.SUBMITTED) {
                        response.requireVerification = false;
                        response.errorCode = error_util_1.ErrorMessage.USER_STATUS_SUBMITTED;
                    }
                    if (user.accountStatus === user_schema_1.Status.REVIEW_REQUIRED) {
                        const code = (0, uuid_1.v4)();
                        await this.tokenModel.create({
                            userId: user._id,
                            code: code,
                            locationInfo: locationInfo,
                            systemInfo: systemInfo,
                            purpose: token_schema_1.Purpose.SIGN_IN,
                        });
                        if (user.isMobileVerified && user.isEmailVerified) {
                            if (user.isTermsAccepted) {
                                switch (user.userRole) {
                                    case user_schema_1.UserRole.INVESTOR:
                                        response.redirectUrl = `/signup/${user.userRole.toLocaleLowerCase()}/info/basic?id=${user._id}`;
                                        break;
                                    case user_schema_1.UserRole.FUND:
                                        response.redirectUrl = `/signup/${user.userRole.toLocaleLowerCase()}/info/primary?id=${user._id}`;
                                        break;
                                    case user_schema_1.UserRole.COMPANY:
                                        response.redirectUrl = `/signup/${user.userRole.toLocaleLowerCase()}/info/primary?id=${user._id}`;
                                        break;
                                    case user_schema_1.UserRole.INSTITUTIONAL_INVESTOR:
                                        response.redirectUrl = `/signup/corporate-client/info/primary?id=${user._id}`;
                                        break;
                                }
                            }
                            else {
                                response.redirectUrl = `/signup/${user.userRole.toLocaleLowerCase()}/info/terms?id=${user._id}`;
                                if (user.userRole === user_schema_1.UserRole.INSTITUTIONAL_INVESTOR) {
                                    response.redirectUrl = `/signup/corporate-client/info/terms?id=${user._id}`;
                                }
                            }
                        }
                        response.requireVerification = false;
                        response.code = code;
                    }
                    if (user.accountStatus === user_schema_1.Status.APPROVED) {
                        const phone = `${user.countrytCode}${user.mobile}`;
                        const otpExpiry = new Date();
                        const expirySec = this.configService.get('OTP_EXPIRATION');
                        const otp = (0, password_util_1.generateOTP)(6);
                        await this.userModel
                            .updateOne({ email: user.email }, {
                            otp: (0, password_util_1.shaEncrypt)(otp),
                            otpExpirtAt: otpExpiry.setSeconds(otpExpiry.getSeconds() + expirySec),
                        })
                            .exec();
                        const notifyEndPoint = this.configService.get('NOTIFY_ENDPOINT');
                        await (0, request_utils_1.postRequest)(`${notifyEndPoint}/api/v1/notify/email`, {
                            emailId: user.email,
                            templateType: 'otp',
                            subject: 'Verify Sign In',
                            otp: otp,
                        });
                        await (0, request_utils_1.postRequest)(`${notifyEndPoint}/api/v1/notify/mobile`, {
                            mobile: `${phone}`,
                            templateType: 'otp',
                            otp: otp,
                        });
                        response.userId = user._id;
                        response.requireVerification = true;
                        response.code = 'none';
                    }
                }
                else {
                    response.errorCode = error_util_1.ErrorMessage.PASSWORD_MISS_MATCH;
                }
            }
            return response;
        }
        catch (error) {
            console.error(error);
            let response = {};
            await this.kinesisService.log('Error in login', JSON.stringify(error.message));
            response.errorCode = error_util_1.ErrorMessage.SERVER_ERROR;
            return response;
        }
    }
    async verifyLogin(userId, otp, locationInfo, systemInfo) {
        try {
            let response = {};
            let user = await this.userModel.findOne({ _id: userId }).exec();
            if (user === null) {
                response.errorCode = error_util_1.ErrorMessage.USER_NOT_FOUND;
            }
            else {
                if ((0, password_util_1.shaEncrypt)(otp) === user?.otp) {
                    if (user.otpExpirtAt > new Date()) {
                        const code = (0, uuid_1.v4)();
                        const dashboardService = this.configService.get('DASHBOARD_SERVICE');
                        const resp = await (0, request_utils_1.getRequest)(`${dashboardService}/api/v1/dashboard/auth/create-token?id=${user._id}&code=${code}`);
                        if (resp) {
                            if (resp?.tokenActive) {
                                response.isSessionActive = true;
                            }
                            else {
                                await this.tokenModel.create({
                                    userId: user._id,
                                    code: code,
                                    locationInfo: locationInfo,
                                    systemInfo: systemInfo,
                                    purpose: token_schema_1.Purpose.SIGN_IN,
                                });
                                response.requireVerification = false;
                                response.code = code;
                                response.userId = user._id;
                                response.redirectUrl =
                                    this.configService.get('DASHBOARD_URL');
                            }
                        }
                    }
                    else {
                        response.errorCode = error_util_1.ErrorMessage.OTP_MISS_MATCH;
                    }
                }
                else {
                    response.errorCode = error_util_1.ErrorMessage.OTP_MISS_MATCH;
                }
            }
            return response;
        }
        catch (error) {
            let response = {};
            await this.kinesisService.log('Error in validateToken', JSON.stringify(error.message));
            console.log(error.message);
            response.errorCode = error_util_1.ErrorMessage.SERVER_ERROR;
            return response;
        }
    }
    async validateToken(token) {
        try {
            const tenantId = this.configService.get('TENANT_ID');
            const scope = this.configService.get('SCOPES');
            const decoded = this.jwtService.decode(token);
            if (decoded && decoded.code && decoded.tid && decoded.scope) {
                const token = await this.tokenModel.findOne({ code: decoded.code });
                if (token) {
                    if (token.expiresAt >= new Date()) {
                        if (tenantId === decoded.tid && scope === decoded.scope) {
                            return (0, common_response_1.createSuccessResponse)({
                                isValid: true,
                            });
                        }
                    }
                }
                return (0, common_response_1.createSuccessResponse)({
                    isValid: false,
                });
            }
            else {
                return (0, common_response_1.createSuccessResponse)({
                    isValid: false,
                });
            }
        }
        catch (error) {
            await this.kinesisService.log('Error in validateToken', JSON.stringify(error.message));
            console.log(error.message);
            return (0, common_response_1.createFailureResponse)({
                message: 'Error in validateToken',
                isValid: false,
            }, error_util_1.ErrorMessage.SERVER_ERROR);
        }
    }
    async refreshToken(refreshToken) {
        try {
            const token = await this.tokenModel.findOne({ refreshToken });
            if (!token) {
                return (0, common_response_1.createFailureResponse)({
                    message: 'Invalid refresh token',
                    isValid: false,
                });
            }
            if (token.expiresAt <= new Date()) {
                return (0, common_response_1.createFailureResponse)({
                    message: 'Refresh token expired, Please login again',
                    isValid: false,
                });
            }
            const user = await this.userModel.findOne({ _id: token.userId }).exec();
            if (user) {
                const newToken = this.jwtService.sign({
                    emailId: user.email,
                    id: user.id,
                    roles: user.userRole,
                });
                await this.userModel.findOneAndUpdate({ refreshToken }, { accessToken: newToken });
                return (0, common_response_1.createSuccessResponse)({
                    created: true,
                });
            }
            else {
                return (0, common_response_1.createFailureResponse)({
                    created: false,
                    message: 'Error while creating new token',
                });
            }
        }
        catch (error) {
            await this.kinesisService.log('Error in refreshToken', JSON.stringify(error.message));
            return (0, common_response_1.createFailureResponse)({
                message: 'Error in refreshToken',
                isValid: false,
            }, error_util_1.ErrorMessage.SERVER_ERROR);
        }
    }
    async getUser(UserId) {
        try {
            if ((0, error_util_1.isValidObjectId)(UserId)) {
                const user = await this.userModel.findOne({ _id: UserId }).exec();
                if (user) {
                    return (0, common_response_1.createSuccessResponse)({
                        email: user.email,
                        mobile: user.mobile,
                        code: user.countrytCode,
                        userRole: user.userRole,
                        isTermsAccepted: user?.isTermsAccepted,
                        analyst: user?.analyst,
                        status: user?.accountStatus,
                        access: user?.access,
                    });
                }
                else {
                    return (0, common_response_1.createFailureResponse)({ message: 'User not found' }, error_util_1.ErrorMessage.USER_NOT_FOUND);
                }
            }
            else {
                return (0, common_response_1.createFailureResponse)({
                    message: 'User id manipulation',
                }, error_util_1.ErrorMessage.ID_MANIPULATED);
            }
        }
        catch (error) {
            await this.kinesisService.log('Error in fetching user', JSON.stringify(error.message));
            console.error(error);
            return (0, common_response_1.createFailureResponse)({
                message: 'Error in fetching user',
                isValid: false,
            }, error_util_1.ErrorMessage.SERVER_ERROR);
        }
    }
    async getUserLogin(UserId) {
        try {
            if ((0, error_util_1.isValidObjectId)(UserId)) {
                const user = await this.tokenModel
                    .find({
                    userId: new mongoose_2.default.Types.ObjectId(UserId),
                    purpose: token_schema_1.Purpose.SIGN_IN,
                })
                    .select({
                    _id: 0,
                    __v: 0,
                    userId: 0,
                    code: 0,
                    systemInfo: 0,
                })
                    .exec();
                if (user && user?.length > 0) {
                    return (0, common_response_1.createSuccessResponse)(user);
                }
                else {
                    return (0, common_response_1.createFailureResponse)({ message: 'User not found' }, error_util_1.ErrorMessage.USER_NOT_FOUND);
                }
            }
            else {
                return (0, common_response_1.createFailureResponse)({
                    message: 'User id manipulation',
                }, error_util_1.ErrorMessage.ID_MANIPULATED);
            }
        }
        catch (error) {
            await this.kinesisService.log('Error in fetching user', JSON.stringify(error.message));
            console.error(error);
            return (0, common_response_1.createFailureResponse)({
                message: 'Error in fetching user',
                isValid: false,
            }, error_util_1.ErrorMessage.SERVER_ERROR);
        }
    }
    async assignAnalyst(request) {
        try {
            if ((0, error_util_1.isValidObjectId)(request.userId)) {
                const user = await this.userModel
                    .findOne({ _id: request.userId })
                    .exec();
                if (user) {
                    await this.userModel.updateOne({ _id: request.userId }, {
                        $set: {
                            analyst: {
                                assignedAnalyst: request.assignedTo,
                                assignedBy: request.assignedBy,
                                assignedOn: new Date(),
                            },
                        },
                    });
                    const notifyEndPoint = this.configService.get('NOTIFY_ENDPOINT');
                    await (0, request_utils_1.postRequest)(`${notifyEndPoint}/api/v1/notify/email`, {
                        emailId: request.assignedTo,
                        templateType: 'assign-analyst',
                        subject: 'New user assigned',
                    });
                    return (0, common_response_1.createSuccessResponse)({
                        assignedOn: new Date(),
                    });
                }
                else {
                    return (0, common_response_1.createFailureResponse)({ message: 'User not found' }, error_util_1.ErrorMessage.USER_NOT_FOUND);
                }
            }
            else {
                return (0, common_response_1.createFailureResponse)({
                    message: 'User id manipulation',
                }, error_util_1.ErrorMessage.ID_MANIPULATED);
            }
        }
        catch (error) {
            await this.kinesisService.log('Error in fetching user', JSON.stringify(error.message));
            console.error(error);
            return (0, common_response_1.createFailureResponse)({
                message: 'Error in fetching user',
                isValid: false,
            }, error_util_1.ErrorMessage.SERVER_ERROR);
        }
    }
    async acceptTermsAndCondition(UserId, isAccepted) {
        try {
            console.log('Accepting terms and conditions', UserId);
            if ((0, error_util_1.isValidObjectId)(UserId)) {
                const user = await this.userModel.findOne({ _id: UserId }).exec();
                if (user) {
                    await this.userModel.updateOne({ _id: UserId }, {
                        isTermsAccepted: isAccepted,
                    });
                    return (0, common_response_1.createSuccessResponse)({
                        message: 'User accepted terms and conditions',
                    });
                }
                else {
                    return (0, common_response_1.createFailureResponse)({ message: 'User not found' }, error_util_1.ErrorMessage.USER_NOT_FOUND);
                }
            }
            else {
                return (0, common_response_1.createFailureResponse)({
                    message: 'User id manipulation',
                }, error_util_1.ErrorMessage.ID_MANIPULATED);
            }
        }
        catch (error) {
            await this.kinesisService.log('Error in fetching user', JSON.stringify(error.message));
            console.error(error);
            return (0, common_response_1.createFailureResponse)({
                message: 'Error in fetching user',
                isValid: false,
            }, error_util_1.ErrorMessage.SERVER_ERROR);
        }
    }
    async approveUser(UserId, approverMail, access) {
        try {
            if ((0, error_util_1.isValidObjectId)(UserId)) {
                const user = await this.userModel.findOne({ _id: UserId }).exec();
                if (user) {
                    await this.userModel.updateOne({ _id: UserId }, {
                        $set: {
                            accountStatus: user_schema_1.Status.APPROVED,
                            'analyst.finalApprover': approverMail,
                            'analyst.finalAprrovedOn': new Date(),
                            access: access,
                        },
                    });
                    return (0, common_response_1.createSuccessResponse)({
                        message: 'User Approved',
                    });
                }
                else {
                    return (0, common_response_1.createFailureResponse)({ message: 'User not found' }, error_util_1.ErrorMessage.USER_NOT_FOUND);
                }
            }
            else {
                return (0, common_response_1.createFailureResponse)({
                    message: 'User id manipulation',
                }, error_util_1.ErrorMessage.ID_MANIPULATED);
            }
        }
        catch (error) {
            await this.kinesisService.log('Error in fetching user', JSON.stringify(error.message));
            console.error(error);
            return (0, common_response_1.createFailureResponse)({
                message: 'Error in fetching user',
                isValid: false,
            }, error_util_1.ErrorMessage.SERVER_ERROR);
        }
    }
    async updateUser(UserId, analystMail, access) {
        try {
            if ((0, error_util_1.isValidObjectId)(UserId)) {
                const user = await this.userModel.findOne({ _id: UserId }).exec();
                if (user) {
                    await this.userModel.updateOne({ _id: UserId }, {
                        $set: {
                            'analyst.accessUpdatedAnalyst': analystMail,
                            'analyst.accessUpdatedOn': new Date(),
                            access: access,
                        },
                    });
                    return (0, common_response_1.createSuccessResponse)({
                        message: 'User Approved',
                    });
                }
                else {
                    return (0, common_response_1.createFailureResponse)({ message: 'User not found' }, error_util_1.ErrorMessage.USER_NOT_FOUND);
                }
            }
            else {
                return (0, common_response_1.createFailureResponse)({
                    message: 'User id manipulation',
                }, error_util_1.ErrorMessage.ID_MANIPULATED);
            }
        }
        catch (error) {
            await this.kinesisService.log('Error in fetching user', JSON.stringify(error.message));
            console.error(error);
            return (0, common_response_1.createFailureResponse)({
                message: 'Error in fetching user',
                isValid: false,
            }, error_util_1.ErrorMessage.SERVER_ERROR);
        }
    }
    async evaluateUserAccess(req) {
        try {
            if ((0, error_util_1.isValidObjectId)(req.userId)) {
                const user = await this.userModel.findOne({ _id: req.userId }).exec();
                if (user) {
                    const hasAccess = user.access.some((rule) => rule.module.toLocaleLowerCase() ===
                        req.module.toLocaleLowerCase() && rule.allowed);
                    return (0, common_response_1.createSuccessResponse)({
                        isAllowed: !!hasAccess,
                    });
                }
                else {
                    return (0, common_response_1.createSuccessResponse)({
                        isAllowed: false,
                    });
                }
            }
            else {
                return (0, common_response_1.createSuccessResponse)({
                    isAllowed: false,
                });
            }
        }
        catch (error) {
            await this.kinesisService.log('Error in fetching user', JSON.stringify(error.message));
            console.error(error);
            return (0, common_response_1.createSuccessResponse)({
                isAllowed: false,
            });
        }
    }
};
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __param(3, (0, mongoose_1.InjectModel)(user_schema_1.User.name)),
    __param(4, (0, mongoose_1.InjectModel)(token_schema_1.Token.name)),
    __metadata("design:paramtypes", [jwt_1.JwtService,
        config_1.ConfigService, typeof (_a = typeof kinesis_logger_1.KinesisService !== "undefined" && kinesis_logger_1.KinesisService) === "function" ? _a : Object, typeof (_b = typeof mongoose_2.Model !== "undefined" && mongoose_2.Model) === "function" ? _b : Object, typeof (_c = typeof mongoose_2.Model !== "undefined" && mongoose_2.Model) === "function" ? _c : Object])
], AuthService);
//# sourceMappingURL=auth.service.js.map