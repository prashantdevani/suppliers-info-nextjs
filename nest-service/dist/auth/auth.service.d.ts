import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { AccessRule, UserDocument } from '../user/user.schema';
import { Model } from 'mongoose';
import { TokenDocument } from '../token/token.schema';
import { LoginResponse, Response } from '../common/common.response';
import { KinesisService } from '../logger/kinesis.logger';
import { AssignAnalystRequest, EvaluateUserRequest } from '../validators/auth.validator';
export declare class AuthService {
    private readonly jwtService;
    private readonly configService;
    private readonly kinesisService;
    private readonly userModel;
    private readonly tokenModel;
    constructor(jwtService: JwtService, configService: ConfigService, kinesisService: KinesisService, userModel: Model<UserDocument>, tokenModel: Model<TokenDocument>);
    login(cred: string, passsword: string, isEmail: boolean | string, locationInfo: object, systemInfo: object): Promise<LoginResponse>;
    verifyLogin(userId: string, otp: string, locationInfo: object, systemInfo: object): Promise<LoginResponse>;
    validateToken(token: string): Promise<Response<object>>;
    refreshToken(refreshToken: string): Promise<Response<object>>;
    getUser(UserId: string): Promise<Response<object>>;
    getUserLogin(UserId: string): Promise<Response<object>>;
    assignAnalyst(request: AssignAnalystRequest): Promise<Response<object>>;
    acceptTermsAndCondition(UserId: string, isAccepted: boolean): Promise<Response<object>>;
    approveUser(UserId: string, approverMail: string, access: AccessRule[]): Promise<Response<object>>;
    updateUser(UserId: string, analystMail: string, access: AccessRule[]): Promise<Response<object>>;
    evaluateUserAccess(req: EvaluateUserRequest): Promise<Response<object>>;
}
