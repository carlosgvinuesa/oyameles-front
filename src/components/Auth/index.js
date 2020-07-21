import React, { useState } from "react";
import Section from "~commons/Section";
import { useLocation, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { login, signup } from "~redux/AuthDuck";
import { useHistory } from "react-router-dom";
import styled from "styled-components";

const Background = styled.div`
  background-image: url("https://upload.wikimedia.org/wikipedia/commons/thumb/1/15/Field-pines-mountain.jpg/1200px-Field-pines-mountain.jpg");
  height: 800px;
  background-color: #b1debe;
  background-position: center; /* Center the image */
  background-repeat: no-repeat; /* Do not repeat the image */
  background-size: cover; /* Resize the background image to cover the entire container */
`;

const Auth = () => {
  const location = useLocation();
  const dispatch = useDispatch();
  const { push } = useHistory();
  const status = useSelector((state) => state.user.status);
  const isLogin = location.pathname.includes("login");
  const [credentials, setCredentials] = useState({});

  const handleSubmit = (e) => {
    e.preventDefault();
    isLogin
      ? dispatch(login(credentials, push))
      : dispatch(signup(credentials, push));
  };

  const handleChange = (e) => {
    const key = e.target.name;
    const value = e.target.value;
    setCredentials((prevState) => ({ ...prevState, [key]: value }));
  };

  return (
    <Background>
      <Section>
        <div className="uk-flex uk-flex-center">
          <div className="uk-width-1-4">
            <h3>{isLogin ? "Login" : "Signup"}</h3>
            <form
              onSubmit={handleSubmit}
              className="uk-width-1-1 uk-form-stacked uk-flex uk-flex-center uk-flex-column"
            >
              <div className="uk-margin">
                {isLogin ? (
                  ""
                ) : (
                  <div>
                    <label className="uk-form-label" htmlFor="email">
                      Nombre:
                    </label>
                    <div className="uk-inline">
                      <span
                        className="uk-form-icon uk-form-icon-flip"
                        uk-icon=""
                      ></span>
                      <input
                        onChange={handleChange}
                        id="nombre"
                        name="nombre"
                        className="uk-input"
                        type="text"
                        required
                      />
                    </div>
                  </div>
                )}
                <label className="uk-form-label" htmlFor="email">
                  Email:
                </label>
                <div className="uk-inline">
                  <span
                    className="uk-form-icon uk-form-icon-flip"
                    uk-icon="icon: mail"
                  ></span>
                  <input
                    onChange={handleChange}
                    id="email"
                    name="email"
                    className="uk-input"
                    type="email"
                    required
                  />
                </div>
                <div className="uk-margin">
                  <label className="uk-form-label" htmlFor="password">
                    Password:
                  </label>
                  <div className="uk-inline">
                    <span
                      className="uk-form-icon uk-form-icon-flip"
                      uk-icon="icon: lock"
                    ></span>
                    <input
                      onChange={handleChange}
                      id="password"
                      name="password"
                      className="uk-input"
                      type="password"
                      required
                    />
                  </div>
                </div>
              </div>
              {isLogin ? (
                <div className="uk-text-meta">
                  Aún no tienes cuenta?{" "}
                  <Link className="uk-text-primary" to="/signup">
                    Crear cuenta
                  </Link>
                </div>
              ) : null}
              <button
                className="uk-button uk-button-primary"
                disabled={status === "pending"}
              >
                {status !== "pending" && (
                  <span>{isLogin ? "Login" : "Signup"}</span>
                )}
                {status === "pending" && <div uk-spinner="true"></div>}
              </button>
            </form>
          </div>
        </div>
      </Section>
    </Background>
  );
};

export default Auth;
