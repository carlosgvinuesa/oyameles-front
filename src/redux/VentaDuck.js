import axios from "axios";
import { base_url } from "./variables";
import { normalizeData } from "../utils/formatters";

//Action types
const LOADING = "oyameles/ventas/LOADING";

const GET_VENTAS_SUCCESS = "oyameles/ventas/GET_VENTAS_SUCCESS";
const GET_VENTAS_ERROR = "oyameles/ventas/GET_VENTAS_ERROR";

const CREATE_VENTA_SUCCESS = "oyameles/ventas/CREATE_VENTA_SUCCESS";
const CREATE_VENTA_ERROR = "oyameles/ventas/CREATE_VENTA_ERROR";

const EDIT_VENTA_SUCCESS = "oyameles/ventas/EDIT_VENTA_SUCCESS";
const EDIT_VENTA_ERROR = "oyameles/ventas/EDIT_VENTA_ERROR";

const DELETE_VENTA_SUCCESS = "oyameles/ventas/DELETE_VENTA_SUCCESS";
const DELETE_VENTA_ERROR = "oyameles/ventas/DELETE_VENTA_ERROR";

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

    case GET_VENTAS_SUCCESS:
      return { ...state, status: "success", items: { ...action.payload } };

    case GET_VENTAS_ERROR:
      return { ...state, status: "error", error: action.error };

    case CREATE_VENTA_SUCCESS:
      return {
        ...state,
        status: "success",
        items: { ...state.items, [action.payload._id]: action.payload },
      };

    case CREATE_VENTA_ERROR:
      return { ...state, status: "error", error: action.error };

    case EDIT_VENTA_SUCCESS:
      return {
        ...state,
        status: "success",
        items: { ...state.items, [action.payload._id]: action.payload },
      };

    case EDIT_VENTA_ERROR:
      return { ...state, status: "error", error: action.error };

    case DELETE_VENTA_SUCCESS:
      return { ...state, status: "success" };

    case DELETE_VENTA_ERROR:
      return { ...state, status: "error", error: action.error };

    default:
      return state;
  }
}

//Action creators
export const loadingVentas = () => ({
  type: LOADING,
});

export const getVentasSuccess = (payload) => ({
  type: GET_VENTAS_SUCCESS,
  payload,
});

export const getVentasError = (error) => ({
  type: GET_VENTAS_ERROR,
  error,
});

export const createVentaSuccess = (payload) => ({
  type: CREATE_VENTA_SUCCESS,
  payload,
});

export const createVentaError = (error) => ({
  type: CREATE_VENTA_ERROR,
  error,
});

export const editVentaSuccess = (payload) => ({
  type: EDIT_VENTA_SUCCESS,
  payload,
});

export const editVentaError = (error) => ({
  type: EDIT_VENTA_ERROR,
  error,
});

export const deleteVentaSuccess = (payload) => ({
  type: EDIT_VENTA_SUCCESS,
  payload,
});

export const deleteVentaError = (error) => ({
  type: EDIT_VENTA_ERROR,
  error,
});

//Thunks
export const fetchVentas = () => (dispatch) => {
  dispatch(loadingVentas());
  return axios
    .get(`${base_url}/ventas`)
    .then((res) => {
      const items = normalizeData(res.data.result);
      dispatch(getVentasSuccess(items));
    })
    .catch((err) => {
      dispatch(getVentasError(err));
    });
};

export const createVenta = (data) => (dispatch) => {
  dispatch(loadingVentas());
  return axios
    .post(`${base_url}/ventas`, data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    })
    .then((res) => {
      dispatch(createVentaSuccess(res.data.result));
    })
    .catch((err) => {
      dispatch(createVentaError(err));
    });
};

export const editVenta = (data, id) => (dispatch) => {
  dispatch(loadingVentas());
  return axios
    .patch(`${base_url}/ventas/${id}`, data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    })
    .then((res) => {
      dispatch(editVentaSuccess(res.data.result));
    })
    .catch((err) => {
      dispatch(editVentaError(err));
    });
};

export const deleteVenta = (id) => (dispatch) => {
  dispatch(loadingVentas());
  return axios
      .delete(`${base_url}/ventas/${id}`)
      .then((res) => {
          dispatch(deleteVentaSuccess(res.data.result));
      })
      .catch((err) => {
          dispatch(deleteVentaError(err));
      })
};