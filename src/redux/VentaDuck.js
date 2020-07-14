import axios from "axios";
import { normalizeData } from "../utils/formatters";

const LOADING = "oyameles/ventas/LOADING";
const GET_VENTAS_SUCCESS = "oyameles/ventas/GET_VENTAS_SUCCESS";
const GET_VENTAS_ERROR = "oyameles/ventas/GET_VENTAS_ERROR";

const CREATE_VENTAS_SUCCESS = "oyameles/ventas/CREATE_VENTAS_SUCCESS";
const CREATE_VENTAS_ERROR = "oyameles/ventas/CREATE_VENTAS_ERROR";

const initialState = {
  items: {},
  status: "",
  error: undefined,
};

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case LOADING:
      return { ...state, status: "pending" };

    case GET_VENTAS_SUCCESS:
      return { ...state, status: "success", items: { ...action.payload } };

    case GET_VENTAS_ERROR:
      return { ...state, status: "error", error: action.error };

    case CREATE_VENTAS_SUCCESS:
      return {
        ...state,
        status: "success",
        items: { ...state.items, [action.payload._id]: action.payload },
      };

    case CREATE_VENTAS_ERROR:
      // return error
      return state;

    default:
      return state;
  }
}

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
  type: CREATE_VENTAS_SUCCESS,
  payload,
});

export const fetchVentas = () => (dispatch) => {
  dispatch(loadingVentas());
  return axios
    .get("http://localhost:3000/ventas")
    .then((res) => {
      const items = normalizeData(res.data.result);
      dispatch(getVentasSuccess(items));
    })
    .catch((err) => {
      dispatch(getVentasError(err));
    });
};

export const createLote = (data, push) => (dispatch) => {
  dispatch(loadingVentas());
  return axios
    .post("http://localhost:3000/ventas", data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    })
    .then((res) => {
      console.log(res.data);
      dispatch(createVentaSuccess(res.data.result));
    });
};
