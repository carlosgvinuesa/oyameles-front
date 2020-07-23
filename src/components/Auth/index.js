import React, { useState } from "react";
import Section from "~commons/Section";
import { useLocation, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { login, signup } from "~redux/AuthDuck";
import { useHistory } from "react-router-dom";
import styled from "styled-components";
import Slider from "~commons/Slider";

const Background = styled.div`
  background-image: url("https://res.cloudinary.com/dwgevym2s/image/upload/v1595465388/oyameles/oyameles12_c0jyiv.png");
  height: 30rem;
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
    <div
      className="uk-child-width-1-3@s uk-child-width-1-3@m uk-child-width-1-3@l uk-flex-center"
      uk-grid="masonry: true"
    >
      <div>
        <div className="uk-card uk-card-default uk-margin-top">
          <Slider
            images={[
              "https://res.cloudinary.com/dwgevym2s/image/upload/v1595465418/oyameles/rnd6_k44t90.png",
            ]}
          />
        </div>
      </div>
      <div>
        <Background className="uk-card uk-card-default uk-card-body uk-margin-top">
          <div className="uk-flex uk-flex-center">
            <div className="uk-width-1">
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
                      <div className="uk-inline">
                        <span
                          className="uk-form-icon uk-form-icon-flip"
                          uk-icon=""
                        ></span>
                        <input
                          onChange={handleChange}
                          id="nombre"
                          name="nombre"
                          placeholder="nombre completo"
                          className="uk-input"
                          type="text"
                          required
                        />
                      </div>
                      <hr></hr>
                      <div className="uk-inline">
                        <span
                          className="uk-form-icon uk-form-icon-flip"
                          uk-icon=""
                        ></span>
                        <input
                          onChange={handleChange}
                          id="celular"
                          name="celular"
                          placeholder="celular"
                          className="uk-input"
                          type="text"
                        />
                      </div>
                    </div>
                  )}
                  <hr></hr>
                  <div className="uk-inline">
                    <span
                      className="uk-form-icon uk-form-icon-flip"
                      uk-icon="icon: mail"
                    ></span>
                    <input
                      onChange={handleChange}
                      id="email"
                      name="email"
                      placeholder="email"
                      className="uk-input"
                      type="email"
                      required
                    />
                  </div>
                  <hr></hr>
                  <div className="uk-inline">
                    <span
                      className="uk-form-icon uk-form-icon-flip"
                      uk-icon="icon: lock"
                    ></span>
                    <input
                      onChange={handleChange}
                      id="password"
                      name="password"
                      placeholder="password"
                      className="uk-input"
                      type="password"
                      required
                    />
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
        </Background>
      </div>
      <div>
        <div className="uk-card uk-card-default uk-margin-top">
          <Slider
            images={[
              "https://res.cloudinary.com/dwgevym2s/image/upload/v1595465416/oyameles/rnd1_iqmugz.png",
            ]}
          />
        </div>
      </div>
      <div>
        <div className="uk-card uk-card-default uk-margin-top">
          <Slider
            images={[
              "https://res.cloudinary.com/dwgevym2s/image/upload/v1595465407/oyameles/rnd8_zdhadw.png",
            ]}
          />
        </div>
      </div>
      <div>
        <div className="uk-card uk-card-default uk-margin-top">
          <Slider
            images={[
              "https://res.cloudinary.com/dwgevym2s/image/upload/v1595465416/oyameles/rnd4_zlqedg.png",
            ]}
          />
        </div>
      </div>
      <div>
        <div className="uk-card uk-card-default uk-margin-top">
          <Slider
            images={[
              "https://res.cloudinary.com/dwgevym2s/image/upload/v1595465418/oyameles/rnd3_yycgef.png",
            ]}
          />
        </div>
      </div>
    </div>
  );
};

export default Auth;
