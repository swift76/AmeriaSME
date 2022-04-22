import { AnyAction, Dispatch } from 'redux';
import { IChangePasswordDataSend, IPostUserDataSend } from 'app/store/reducers/user/models';

import { BASE_URL } from 'app/configs/constants';
import axios from 'app/api';
import qs from 'qs';
import { toast } from 'react-toastify';
import { userActions } from 'app/store/reducers/root-actions';

// USER LOGIN
export const userLogin = (data: IPostUserDataSend) => async (dispatch: Dispatch<AnyAction>) => {
    dispatch(userActions.userLoginRequest());
    try {
        const response = await axios.post(`${BASE_URL}/Account/Login`, qs.stringify(data));
        dispatch(userActions.userLoginSuccess(response.data));
        return response.data;
    } catch (error) {
        const resData = error.response && error.response.data;
        toast.error(resData.error_description);
        dispatch(userActions.userLoginFail(resData));
        return Promise.reject(resData);
    }
};

export const userchangePassword = (data: IChangePasswordDataSend) => async (
    dispatch: Dispatch<AnyAction>
) => {
    try {
        const response = await axios.post(`${BASE_URL}/Account/ChangePassword`, qs.stringify(data));
        dispatch(userActions.userLogout());
        return response.data;
    } catch (error) {
        const resData = error.response.data;
        resData.message ? toast.error(resData.message) : toast.error(resData);
        return Promise.reject(resData);
    }
};

export const userLogout = () => async (dispatch: Dispatch<AnyAction>) => {
    const response = await axios.get(`${BASE_URL}/Account/Logout`);
    dispatch(userActions.userLogout());
};

export const getUserInfo = () => async (dispatch: Dispatch<AnyAction>) => {
    dispatch(userActions.userInfoFetchRequest());
    try {
        const response = await axios.get(`/BankUsers`);
        dispatch(userActions.userInfoFetchSuccess(response.data));
    } catch (error) {
        dispatch(userActions.userInfoFetchFail());
    }
};
