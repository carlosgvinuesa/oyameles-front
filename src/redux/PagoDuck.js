import axios from "axios";
import { base_url } from "./variables";
import { normalizeData } from "../utils/formatters";

//Action types
const LOADING = "oyameles/pagos/LOADING";

const GET_PAGOS_SUCCESS = "oyameles/pagos/GET_PAGOS_SUCCESS";
const GET_PAGOS_ERROR = "oyameles/pagos/GET_PAGOS_ERROR";

const CREATE_PAGO_SUCCESS = "oyameles/pagos/CREATE_PAGO_SUCCESS";
const CREATE_PAGO_ERROR = "oyameles/pagos/CREATE_PAGO_ERROR";

const EDIT_PAGO_SUCCESS = "oyameles/pagos/EDIT_PAGO_SUCCESS";
const EDIT_PAGO_ERROR = "oyameles/pagos/EDIT_PAGO_ERROR";

const DELETE_PAGO_SUCCESS = "oyameles/pagos/DELETE_PAGO_SUCCESS";
const DELETE_PAGO_ERROR = "oyameles/pagos/DELETE_PAGO_ERROR";

//Setting initial state
const initialState = {
  items: {},
  status: "",
  error: undefined,
};

//Reducer
export default function reducer(state = initialState, action) {
  switch (action.type) {
    case LOADING:
      return { ...state, status: "pending" };

    case GET_PAGOS_SUCCESS:
      return { ...state, status: "success", items: { ...action.payload } };

    case GET_PAGOS_ERROR:
      return { ...state, status: "error", error: action.error };

    case CREATE_PAGO_SUCCESS:
      return {
        ...state,
        status: "success",
        items: { ...state.items, [action.payload._id]: action.payload },
      };

    case CREATE_PAGO_ERROR:
      return { ...state, status: "error", error: action.error };

    case EDIT_PAGO_SUCCESS:
      return {
        ...state,
        status: "success",
        items: { ...state.items, [action.payload._id]: action.payload },
      };

    case EDIT_PAGO_ERROR:
      return { ...state, status: "error", error: action.error };

    case DELETE_PAGO_SUCCESS:
      return { ...state, status: "success" };

    case DELETE_PAGO_ERROR:
      return { ...state, status: "error", error: action.error };

    default:
      return state;
  }
}

export const loadingPagos = () => ({
  type: LOADING,
});

export const getPagosSuccess = (payload) => ({
  type: GET_PAGOS_SUCCESS,
  payload,
});

export const getPagosError = (error) => ({
  type: GET_PAGOS_ERROR,
  error,
});

export const createPagoSuccess = (payload) => ({
  type: CREATE_PAGO_SUCCESS,
  payload,
});

export const createPagoError = (error) => ({
  type: CREATE_PAGO_ERROR,
  error,
});

export const editPagoSuccess = (payload) => ({
  type: EDIT_PAGO_SUCCESS,
  payload,
});

export const editPagoError = (error) => ({
  type: EDIT_PAGO_ERROR,
  error,
});

export const deletePagoSuccess = (payload) => ({
  type: DELETE_PAGO_SUCCESS,
  payload,
});

export const deletePagoError = (error) => ({
  type: DELETE_PAGO_ERROR,
  error,
});

//Thunks
export const fetchPagos = () => (dispatch) => {
  dispatch(loadingPagos());
  return axios
    .get(`${base_url}/pagos/pagos`)
    .then((res) => {
      const items = normalizeData(res.data.result);
      dispatch(getPagosSuccess(items));
    })
    .catch((err) => {
      dispatch(getPagosError(err));
    });
};

export const createPago = (data, push) => (dispatch) => {
  dispatch(loadingPagos());
  return axios
    .post(`${base_url}/pagos`, data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    })
    .then((res) => {
      dispatch(createPagoSuccess(res.data.result));
    });
};

export const editPago = (params) => (dispatch) => {
  dispatch(loadingPagos());
  return axios
    .patch(`${base_url}/pagos/${params.id}`, params.data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    })
    .then((res) => {
      dispatch(editPagoSuccess(res.data.result));
    })
    .catch((err) => {
      dispatch(editPagoError(err));
    });
};

export const deletePago = (id) => (dispatch) => {
  dispatch(loadingPagos());
  return axios
    .delete(`${base_url}/pagos/${id}`)
    .then((res) => {
      dispatch(deletePagoSuccess(res.data.result));
    })
    .catch((err) => {
      dispatch(deletePagoError(err));
    });
};
