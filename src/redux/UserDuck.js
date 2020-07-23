import axios from "axios";
import { base_url } from "./variables";
import { normalizeData } from "../utils/formatters";
axios.defaults.withCredentials = true;

const LOADING = "oyameles/users/LOADING";

const FETCH_USERS_SUCCESS = "oyameles/users/FETCH_USERS_SUCCESS";
const FETCH_USERS_ERROR = "oyameles/users/FETCH_USERS_ERROR";

const CREATE_USER_SUCCESS = "oyameles/users/CREATE_USER_SUCCESS";
const CREATE_USER_ERROR = "oyameles/users/CREATE_USER_ERROR";

const EDIT_USER_SUCCESS = "oyameles/users/EDIT_USER_SUCCESS";
const EDIT_USER_ERROR = "oyameles/users/EDIT_USER_ERROR";

const DELETE_USER_SUCCESS = "oyameles/users/DELETE_USER_SUCCESS";
const DELETE_USER_ERROR = "oyameles/users/DELETE_USER_ERROR";

const initialState = {
  items: {},
  status: "",
  error: undefined,
};

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case LOADING:
      return { ...state, status: "pending" };

    case FETCH_USERS_SUCCESS:
      return { ...state, status: "success", items: { ...action.payload } };
    case FETCH_USERS_ERROR:
      return { ...state, status: "error", error: action.error };

    case CREATE_USER_SUCCESS:
      return {
        ...state,
        status: "success",
        users: { ...state.users, [action.payload._id]: action.payload },
      };
    case CREATE_USER_ERROR:
      return { ...state, status: "error", error: action.error };

    case EDIT_USER_SUCCESS:
      return {
        ...state,
        status: "success",
        items: { ...state.users, [action.payload._id]: action.payload },
      };
    case EDIT_USER_ERROR:
      return { ...state, status: "error", error: action.error };

    case DELETE_USER_SUCCESS:
      return { ...state, status: "success" };
    case DELETE_USER_ERROR:
      return { ...state, status: "error", error: action.error };

    default:
      return state;
  }
}

export const loading = () => ({
  type: LOADING,
});

export const fetchUsersSuccess = (payload) => ({
  type: FETCH_USERS_SUCCESS,
  payload,
});

export const fetchUsersError = (error) => ({
  type: FETCH_USERS_ERROR,
  error,
});

export const createUserSuccess = (payload) => ({
  type: CREATE_USER_SUCCESS,
  payload,
});

export const createUserError = (error) => ({
  type: CREATE_USER_ERROR,
  error,
});

export const editUserSuccess = (payload) => ({
  type: EDIT_USER_SUCCESS,
  payload,
});

export const editUserError = (error) => ({
  type: EDIT_USER_ERROR,
  error,
});

export const deleteUserSuccess = (payload) => ({
  type: DELETE_USER_SUCCESS,
  payload,
});

export const deleteUserError = (error) => ({
  type: DELETE_USER_ERROR,
  error,
});

// thunks

export const fetchUsers = () => (dispatch) => {
  dispatch(loading());
  return axios
    .get(`${base_url}/users`)
    .then((res) => {
      const users = normalizeData(res.data.result);
      dispatch(fetchUsersSuccess(users));
    })
    .catch((err) => {
      dispatch(fetchUsersError(err));
    });
};

export const createUser = (data) => (dispatch) => {
  dispatch(loading());
  return axios
    .post(`${base_url}/users/signup`, data)
    .then((res) => {
      dispatch(createUserSuccess(res.data.msg));
    })
    .catch((err) => {
      dispatch(createUserError(err));
    });
};

export const editUser = (params) => (dispatch) => {
  dispatch(loading());
  return axios
    .patch(`${base_url}/users/${params.id}`, params.data)
    .then((res) => {
      dispatch(editUserSuccess(res.data.result));
    })
    .catch((err) => {
      dispatch(editUserError(err));
    });
};

export const deleteUser = (id) => (dispatch) => {
  dispatch(loading());
  return axios
    .delete(`${base_url}/users/${id}`)
    .then((res) => {
      dispatch(deleteUserSuccess(res.data.user));
    })
    .catch((err) => {
      dispatch(deleteUserSuccess(err));
    });
};
