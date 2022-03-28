export interface IPostUserDataSend {
    readonly Username: string,
    readonly Password: string,
    readonly ReturnUrl: string
}

// LOGIN DATA TYPES
export interface IUserInfoData {
    readonly CLOSE_DATE: null;
    readonly CREATE_DATE: null;
    readonly EMAIL: string;
    readonly FIRST_NAME_AM: string;
    readonly HASH: null;
    readonly ID: null;
    readonly IS_ADMINISTRATOR: null;
    readonly LAST_NAME_AM: string;
    readonly LOGIN: null;
    readonly MOBILE_PHONE: string;
    readonly PASSWORD: null;
    readonly PASSWORD_EXPIRY_DATE: null;
    readonly USER_ROLE_ID: number;
    readonly USER_STATE_ID: null;
}


// LOGIN DATA TYPES
export interface IUserLoginData {
    readonly access_token: string;
    readonly expires_in: number;
    readonly refresh_token: string;
    readonly token_type: number;
}

// FETCH ERROR DATA TYPES
export interface IUserLoginError {
    readonly error: string;
    readonly error_description: string;
}

export interface IChangePasswordDataSend {
    readonly ReturnUrl: string;
    readonly UserName: string;
    readonly OldPassword: string;
    readonly NewPassword: string;
    readonly ConfirmNewPassword: string;
}