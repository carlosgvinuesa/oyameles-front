import axios from "axios";
import { base_url } from "./variables";
axios.defaults.withCredentials = true;

const LOADING = "oyameles/users/LOADING";

const LOGIN_SUCCESS = "oyameles/users/LOGIN_SUCCESS";
const LOGIN_ERROR = "oyameles/users/LOGIN_ERROR";

const SIGNUP_SUCCESS = "oyameles/users/SIGNUP_SUCCESS";
const SIGNUP_ERROR = "oyameles/users/SIGNUP_ERROR";

const LOGOUT = "oyameles/users/LOGOUT";


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

    case SIGNUP_SUCCESS:
      return { status: "success", data: { ...action.payload } };
    case SIGNUP_ERROR:
      return { status: "error", error: action.error };

    case LOGOUT:
      return initialState;

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

export const signupSuccess = (payload) => ({
  type: LOGIN_SUCCESS,
  payload,
});

export const signupError = (error) => ({
  type: LOGIN_ERROR,
  error,
});

export const logoutSuccess = () => ({
  type: LOGOUT,
});


// thunks

export const login = (credential, push) => (dispatch) => {
  dispatch(loading());
  return axios
    .post(`${base_url}/users/login`, credential)
    .then((res) => {
      const user = res.data.user;
      localStorage.setItem("user", JSON.stringify(user));
      dispatch(loginSuccess(user));
      push("/");
    })
    .catch((res) => dispatch(loginError(res.response.data)));
};


export const signup = (data, push) => (dispatch) => {
  dispatch(loading());
  return axios
    .post(`${base_url}/users/signup`, data)
    .then((res) => {
      dispatch(signupSuccess(res.data.msg));
      push("/login");
    })
    .catch((err) => {
      dispatch(signupError(err));
    });
};

export const logout = (credential, push) => (dispatch) => {
  return axios.post(`${base_url}/users/logout`, credential).then((res) => {
    const user = res.data.user;
    localStorage.removeItem("user", JSON.stringify(user));
    dispatch(logoutSuccess());
    push("/login");
  });
};
