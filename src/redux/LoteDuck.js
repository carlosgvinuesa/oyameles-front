import axios from "axios";
import { normalizeData } from "../utils/formatters";

const LOADING = "oyameles/lotes/LOADING";
const GET_LOTES_SUCCESS = "oyameles/lotes/GET_LOTES_SUCCESS";
const GET_LOTES_ERROR = "oyameles/lotes/GET_LOTES_ERROR";

const CREATE_LOTES_SUCCESS = "oyameles/lotes/CREATE_LOTES_SUCCESS";
const CREATE_LOTES_ERROR = "oyameles/lotes/CREATE_LOTES_ERROR";

const initialState = {
  items: {},
  status: "",
  error: undefined,
};

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case LOADING:
      return { ...state, status: "pending" };

    case GET_LOTES_SUCCESS:
      return { ...state, status: "success", items: { ...action.payload } };

    case GET_LOTES_ERROR:
      return { ...state, status: "error", error: action.error };

    case CREATE_LOTES_SUCCESS:
      return {
        ...state,
        status: "success",
        items: { ...state.items, [action.payload._id]: action.payload },
      };

    case CREATE_LOTES_ERROR:
      // return error
      return state;

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
  type: CREATE_LOTES_SUCCESS,
  payload,
});

export const fetchLotes = (id) => (dispatch) => {
  dispatch(loadingLotes());
  const url = id ? `http://localhost:3000/lotes/lotes?_id=${id}`: `http://localhost:3000/lotes/lotes`;
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
    .post("http://localhost:3000/lotes/lotes", data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    })
    .then((res) => {
      console.log(res.data);
      dispatch(createLoteSuccess(res.data.result));
    });
};
