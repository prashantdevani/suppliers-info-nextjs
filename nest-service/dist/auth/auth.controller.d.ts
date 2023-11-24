import { Response as ExpressResponse } from 'express';
import { AuthService } from './auth.service';
import { ApproveRequest, AssignAnalystRequest, EvaluateUserRequest, SignInRequest, TermsRequest, UpdateRequest, VerifySignInRequest } from '../validators/auth.validator';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    login(body: SignInRequest, res: ExpressResponse): Promise<any>;
    verifyLogin(body: VerifySignInRequest, res: ExpressResponse): Promise<any>;
    validateToken(token: string, res: ExpressResponse): Promise<any>;
    refreshToken(token: string, res: ExpressResponse): Promise<any>;
    acceptTerms(body: TermsRequest, res: ExpressResponse): Promise<any>;
    approveUser(body: ApproveRequest, res: ExpressResponse): Promise<any>;
    updateUser(body: UpdateRequest, res: ExpressResponse): Promise<any>;
    assignAnalyst(body: AssignAnalystRequest, res: ExpressResponse): Promise<any>;
    getUser(id: string, res: ExpressResponse): Promise<any>;
    getUserLogin(id: string, res: ExpressResponse): Promise<any>;
    evaluateUser(body: EvaluateUserRequest, res: ExpressResponse): Promise<any>;
}
