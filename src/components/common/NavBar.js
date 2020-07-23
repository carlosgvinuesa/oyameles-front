import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "~redux/AuthDuck";
import { useHistory } from "react-router-dom";
import "./NavBar.css";

const Navbar = () => {
  const user = useSelector((state) => state.user.data);
  const dispatch = useDispatch();
  const { push } = useHistory();
  const [credentials] = useState({});
  const handleClick = (e) => {
    e.preventDefault();
    dispatch(logout(credentials, push));
  };
  return (
    <nav className="bgcol" uk-navbar="true">
      <div className="uk-navbar-left">
        <ul className="uk-navbar-nav">
          <li className="uk-active">
            <Link to="/">Oyameles</Link>
          </li>
          {user && user.rol === "Admin" ? (
            <li>
              <Link to="/lotes">Lotes</Link>
            </li>
          ) : null}
          {user && user.rol === "Admin" ? (
            <li>
              <Link to="/users">Users</Link>
            </li>
          ) : null}
        </ul>
      </div>
      <div className="uk-navbar-right">
        <ul className="uk-navbar-nav">
          {!user && (
            <li className="">
              <Link to="/login">Login</Link>
            </li>
          )}
          {!user && (
            <li>
              <Link to="/signup">Signup</Link>
            </li>
          )}
          {user && (
            <li>
              <Link to="/profile">{user.nombre}</Link>
              <div className="uk-navbar-dropdown">
                <ul className="uk-nav uk-navbar-dropdown-nav">
                  <li>
                    <button
                      onClick={handleClick}
                      className="uk-button uk-button-default"
                    >
                      Logout
                    </button>
                  </li>
                </ul>
              </div>
            </li>
          )}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
