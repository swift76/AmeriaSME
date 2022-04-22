import { AnyAction, Dispatch } from 'redux';

import { Utils } from 'app/services/utils';
import axios from 'app/api';
import { documents } from 'app/store/reducers/root-actions';
import { toast } from 'react-toastify';

export const getDocuments = (id: string) => async (dispatch: Dispatch<AnyAction>) => {
    dispatch(documents.getDocumentsRequest());
    try {
        const response = await axios.get(`/Applications/${id}/Documents`);
        dispatch(documents.getDocumentsSuccess(response.data));
        return response.data;
    } catch (error) {
        const resData = error && error.response && error.response.data;
        toast.error(Utils.localizedServerErrors(resData.Message));
        dispatch(documents.getDocumentsFail(resData));
        return Promise.reject(resData);
    }
};

export const getDocumentsByType = async (id: string, documentType: string) => {
    try {
        const response = await axios.get(`/Applications/${id}/Documents/${documentType}`);
        return response.data;
    } catch (error) {
        const resData = error && error.response && error.response.data;
        toast.error(Utils.localizedServerErrors(resData.Message));
        return Promise.reject(resData);
    }
};

export const saveDocument = async (id: string, documentType: string, data: FormData) => {
    try {
        const response = await axios.put(`/Applications/${id}/Documents/${documentType}`, data);
        return response.data;
    } catch (error) {
        const resData = error && error.response && error.response.data;
        toast.error(Utils.localizedServerErrors(resData.Message));
        return Promise.reject(resData);
    }
};

export const deleteDocument = async (id: string, documentType: string) => {
    try {
        const response = await axios.delete(`/Applications/${id}/Documents/${documentType}`);
        return response.data;
    } catch (error) {
        const resData = error && error.response && error.response.data;
        toast.error(Utils.localizedServerErrors(resData.Message));
        return Promise.reject(resData);
    }
};
