import axios from "axios";
import { normalizeData } from "../utils/formatters";

//Action types
const LOADING = "oyameles/lotes/LOADING";

const GET_LOTES_SUCCESS = "oyameles/lotes/GET_LOTES_SUCCESS";
const GET_LOTES_ERROR = "oyameles/lotes/GET_LOTES_ERROR";

const CREATE_LOTE_SUCCESS = "oyameles/lotes/CREATE_LOTE_SUCCESS";
const CREATE_LOTE_ERROR = "oyameles/lotes/CREATE_LOTE_ERROR";

const EDIT_LOTE_SUCCESS = "oyameles/lotes/EDIT_LOTE_SUCCESS";
const EDIT_LOTE_ERROR = "oyameles/lotes/EDIT_LOTE_ERROR";

const DELETE_LOTE_SUCCESS = "oyameles/lotes/DELETE_LOTE_SUCCESS";
const DELETE_LOTE_ERROR = "oyameles/lotes/DELETE_LOTE_ERROR";

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

    case GET_LOTES_SUCCESS:
      return { ...state, status: "success", items: { ...action.payload } };

    case GET_LOTES_ERROR:
      return { ...state, status: "error", error: action.error };

    case CREATE_LOTE_SUCCESS:
      return {
        ...state,
        status: "success",
        items: { ...state.items, [action.payload._id]: action.payload },
      };

    case CREATE_LOTE_ERROR:
      return { ...state, status: "error", error: action.error };

    case EDIT_LOTE_SUCCESS:
      return {
        ...state,
        status: "success",
        items: { ...state.items, [action.payload._id]: action.payload },
      };

    case EDIT_LOTE_ERROR:
      return { ...state, status: "error", error: action.error };

    case DELETE_LOTE_SUCCESS:
      return { ...state, status: "success" };

    case DELETE_LOTE_ERROR:
      return { ...state, status: "error", error: action.error };

    default:
      return state;
  }
}

export const loadingLotes = () => ({
  type: LOADING,
});

export const getLotesSuccess = (payload) => ({
  type: GET_LOTES_SUCCESS,
  payload,
});

export const getLotesError = (error) => ({
  type: GET_LOTES_ERROR,
  error,
});

export const createLoteSuccess = (payload) => ({
  type: CREATE_LOTE_SUCCESS,
  payload,
});

export const createLoteError = (error) => ({
  type: CREATE_LOTE_ERROR,
  error,
});

export const editLoteSuccess = (payload) => ({
  type: EDIT_LOTE_SUCCESS,
  payload,
});

export const editLoteError = (error) => ({
  type: EDIT_LOTE_ERROR,
  error,
});

export const deleteLoteSuccess = (payload) => ({
  type: DELETE_LOTE_SUCCESS,
  payload,
});

export const deleteLoteError = (error) => ({
  type: DELETE_LOTE_ERROR,
  error,
});

//Thunks
export const fetchLotes = (id) => (dispatch) => {
  dispatch(loadingLotes());
  const url = id
    ? `http://localhost:3000/lotes/lotes?_id=${id}`
    : `http://localhost:3000/lotes/lotes`;
  return axios
    .get(url)
    .then((res) => {
      const items = normalizeData(res.data.result);
      dispatch(getLotesSuccess(items));
    })
    .catch((err) => {
      dispatch(getLotesError(err));
    });
};

export const createLote = (data, push) => (dispatch) => {
  dispatch(loadingLotes());
  return axios
    .post("http://localhost:3000/lotes", data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    })
    .then((res) => {
      dispatch(createLoteSuccess(res.data.result));
    });
};

export const editLote = (params) => (dispatch) => {
  dispatch(loadingLotes());
  return axios
    .patch(`http://localhost:3000/lotes/${params.id}`, params.data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    })
    .then((res) => {
      dispatch(editLoteSuccess(res.data.result));
    })
    .catch((err) => {
      dispatch(editLoteError(err));
    });
};

export const deleteLote = (id) => (dispatch) => {
  dispatch(loadingLotes());
  return axios
      .delete(`http://localhost:3000/lotes/${id}`)
      .then((res) => {
          dispatch(deleteLoteSuccess(res.data.result));
      })
      .catch((err) => {
          dispatch(deleteLoteError(err));
      })
};
