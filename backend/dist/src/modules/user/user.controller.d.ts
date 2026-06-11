import { UserService } from "./user.service";
import { CurrentUser } from "../auth/auth.model";
import { ChangePasswordDto } from "./dto/change-password";
export declare class UserController {
    private readonly userService;
    constructor(userService: UserService);
    resetPassword(currentUser: CurrentUser, changePasswordDto: ChangePasswordDto): Promise<{
        success: boolean;
    }>;
}
