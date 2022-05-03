import { AnyAction, Dispatch } from 'redux';

import { Utils } from 'app/services/utils';
import axios from 'app/api';
import { directoryActions } from 'app/store/reducers/root-actions';
import { toast } from 'react-toastify';

const { currencies } = directoryActions;

export const getCurrencies = (loanType: string) => async (dispatch: Dispatch<AnyAction>) => {
    dispatch(currencies.getCountriesRequest());
    try {
        const response = await axios.get(`Directory/Currencies/${loanType}`);
        dispatch(currencies.getCountriesSuccess(response.data, loanType));
        return response.data;
    } catch (error) {
        const resData = error && error.response && error.response.data;
        toast.error(Utils.localizedServerErrors(resData.Message));
        dispatch(currencies.getCountriesFail(resData));
        return Promise.reject(resData);
    }
};
