import {IUserInfoData} from './models'
import JwtService from 'app/services/jwtService'

const jwtToken: string | null = JwtService.getAccessToken();
const userLoggedIn: boolean  = !!(jwtToken ? jwtToken : null);
const userInfoStr = JwtService.getUserInfo();
const userInfo = userInfoStr ? JSON.parse(userInfoStr) : null;


export interface IStoreUser {
    readonly userLoggingIn: boolean;
    readonly userLoggedIn: boolean;
    readonly userLoggingFail: boolean;
    readonly userInfo: IUserInfoData;
    readonly userInfoLoading: boolean;
    readonly userInfoLoaded: boolean;
    readonly userInfoLoadError: boolean;
}

const initialState: IStoreUser = {
    userLoggingIn: false,
    userLoggedIn,
    userLoggingFail: false,
    userInfo,
    userInfoLoading: false,
    userInfoLoaded: false,
    userInfoLoadError: false
}


export default initialState;