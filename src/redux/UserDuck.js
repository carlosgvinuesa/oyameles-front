import axios from "axios";
import { normalizeData } from "../utils/formatters";
axios.defaults.withCredentials = true;


const LOADING = "oyameles/user/LOADING";

const LOGIN_SUCCESS = "oyameles/user/LOGIN_SUCCESS";
const LOGIN_ERROR = "oyameles/user/LOGIN_ERROR";

const LOGOUT = "oyameles/user/LOGOUT";

const GET_USERS_SUCCESS = "oyameles/user/GET_USERS_SUCCESS";
const GET_USERS_ERROR = "oyameles/user/GET_USERS_ERROR";

const CREATE_USER_SUCCESS = "oyameles/user/CREATE_USER_SUCCESS"
const CREATE_USER_ERROR = "oyameles/user/CREATE_USER_ERROR"

const EDIT_USER_SUCCESS = "oyameles/user/EDIT_USER_SUCCESS"
const EDIT_USER_ERROR = "oyameles/user/EDIT_USER_ERROR"

const DELETE_USER_SUCCESS = "oyameles/user/DELETE_USER_SUCCESS"
const DELETE_USER_ERROR = "oyameles/user/DELETE_USER_ERROR"

const initialState = {
  data: JSON.parse(localStorage.getItem("user")),
  status: "",
  error: undefined,
};

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case LOADING:
      return { ...state, status: "pending" };

    case LOGIN_SUCCESS:
      return { status: "success", data: { ...action.payload } };
    case LOGIN_ERROR:
      return { status: "error", error: action.error };

    case LOGOUT:
      return initialState;

      case GET_USERS_SUCCESS:
        return { ...state, status: "success", users: { ...action.payload } };
    case GET_USERS_ERROR:
        return { ...state, status: "error", error: action.error }

    case CREATE_USER_SUCCESS:
        return { ...state, status: "success", users: { ...state.users, [action.payload._id]: action.payload } }
    case CREATE_USER_ERROR:
        return { ...state, status: "error", error: action.error }

    case EDIT_USER_SUCCESS:
        return { ...state, status: "success", users: { ...state.users, [action.payload._id]: action.payload } }
    case EDIT_USER_ERROR:
        return { ...state, status: "error", error: action.error }

    case DELETE_USER_SUCCESS:
        return { ...state, status: "success" }
    case DELETE_USER_ERROR:
        return { ...state, status: "error", error: action.error }

    default:
      return state;
  }
}

export const loading = () => ({
  type: LOADING,
});

export const loginSuccess = (payload) => ({
  type: LOGIN_SUCCESS,
  payload,
});

export const loginError = (error) => ({
  type: LOGIN_ERROR,
  error,
});

export const logoutSuccess = () => ({
  type: LOGOUT,
});

export const getUsersSuccess = (payload) => ({
  type: GET_USERS_SUCCESS,
  payload,
});

export const getUsersError = (error) => ({
  type: GET_USERS_ERROR,
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

export const login = (credential, push) => (dispatch) => {
  dispatch(loading());
  return axios
    .post("http://localhost:3000/users/login", credential)
    .then((res) => {
      const user = res.data.user;
      localStorage.setItem("user", JSON.stringify(user));
      dispatch(loginSuccess(user));
      push("/");
    })
    .catch((res) => dispatch(loginError(res.response.data)));
};

export const logout = (credential, push) => (dispatch) => {
  return axios
    .post("http://localhost:3000/users/logout", credential)
    .then((res) => {
      const user = res.data.user;
      localStorage.removeItem("user", JSON.stringify(user));
      dispatch(logoutSuccess());
      push("/login");
    });
};

export const getUsers = () => (dispatch) => {
  dispatch(loading());
  return axios
      .get(`http://localhost:3000/users`)
      .then((res) => {
          const users = normalizeData(res.data.result);
          dispatch(getUsersSuccess(users));
      })
      .catch((err) => {
          dispatch(getUsersError(err));
      })
};

export const createUser = (data) => (dispatch) => {
  dispatch(loading());
  return axios
      .post(`http://localhost:3000/users`, data, { headers: { "Content-Type": "multipart/form-data" } })
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
      .patch(`http://localhost:3000/users/${params.id}`, params.data)
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
      .delete(`http://localhost:3000/users/${id}`)
      .then((res) => {
          dispatch(deleteUserSuccess(res.data.user));
      })
      .catch((err) => {
          dispatch(deleteUserSuccess(err));
      })
};