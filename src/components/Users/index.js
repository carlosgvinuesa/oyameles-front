import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Section from "~commons/Section";
import InputField from "~commons/form/InputField";
import TextAreaField from "~commons/form/TextAreaField";
import { fetchUsers, createUser, editUser } from "~redux/UserDuck";
import { denormalizeData } from "../../utils/formatters";
import { Link } from "react-router-dom";

const Lotes = () => {
  const dispatch = useDispatch();
  const users = useSelector((state) => state.users.items);
  const [nuevoUser, setNuevoUser] = useState({});

  useEffect(() => {
    dispatch(fetchUsers());
  }, [dispatch]);

  const handleCreate = (e) => {
    e.preventDefault();
    let data = nuevoUser;
    dispatch(createUser(data));
  };
  const handleEdit = (e) => {
    e.preventDefault();
    let data = nuevoUser;
    dispatch(editUser(data));
  };

  const handleChange = (e) => {
    const key = e.target.name;
    let value = e.target.files || e.target.value;
    setNuevoUser((prevState) => ({
      ...prevState,
      [key]: value,
    }));
  };

  const llenarData = (e) => {
    // setNuevoUser(denormalizeData(users).find(x=>x._id === user._id))
  };
  console.log(nuevoUser);

  return (
    <div>
      <Section>
        {/* Modal */}
        <button
          className="uk-button uk-button-default uk-margin-small-right "
          type="button"
          uk-toggle="target: #nuevo-user"
        >
          Nuevo Usuario
        </button>
        <div id="nuevo-user" uk-modal="true">
          <div className="uk-modal-dialog uk-modal-body">
            <h2 className="uk-modal-title">Crear nuevo usuario</h2>
            <form
              className="uk-grid-small"
              uk-grid="true"
              onSubmit={handleCreate}
            >
            <br></br>
              <InputField
                name="nombre"
                title="Nombre Completo"
                placeholder="Nombre y apellidos"
                value={nuevoUser.nombre || ""}
                handleChange={handleChange}
                required
              />
              <InputField
                name="email"
                title="Email"
                placeholder="email"
                value={nuevoUser.email || ""}
                handleChange={handleChange}
                required
              />
              <InputField
                name="celular"
                title="Cel"
                placeholder="Cel (10 digitos)"
                value={nuevoUser.celular || ""}
                handleChange={handleChange}
                required
              />
              <InputField
                name="password"
                title="Password"
                placeholder="Password"
                value={nuevoUser.password || ""}
                handleChange={handleChange}
                required
              />
              <InputField
                name="rol"
                title="Rol"
                placeholder="Admin, Cliente, Vendedor"
                value={nuevoUser.rol || ""}
                handleChange={handleChange}
              />
              <TextAreaField
                name="comentarios"
                title="Comentarios"
                placeholder="Agrega comentarios"
                value={nuevoUser.comentarios || ""}
                handleChange={handleChange}
              />
            </form>
            <p className="uk-text-right">
              <button
                className="uk-button uk-button-default uk-modal-close"
                type="button"
              >
                Cancel
              </button>
              <button
                className="uk-button uk-button-primary uk-modal-close"
                type="button"
                onClick={handleCreate}
              >
                Crear
              </button>
            </p>
          </div>
        </div>

        {/* Tabla */}
        <div>
          <div className="uk-overflow-auto">
            <table className="uk-table uk-table-middle uk-table-divider">
              <thead>
                <tr>
                  <th>Nombre</th>
                  <th>Email</th>
                  <th>Celular(m2)</th>
                  <th>Rol</th>
                  <th>Comentarios</th>
                  <th>Editar</th>
                </tr>
              </thead>
              <tbody>
                {denormalizeData(users).map((user, index) => (
                  <tr key={index}>
                    <td>{user.nombre}</td>
                    <td>{user.email}</td>
                    <td>{user.celular}</td>
                    <td>{user.rol}</td>
                    <td>{user.comentarios}</td>
                    <td>
                      {/* Modal */}
                      <button
                        className="uk-button uk-button-default uk-margin-small-right "
                        type="button"
                        uk-toggle="target: #edit-user"
                        onClick={llenarData}
                        disabled
                      >
                        Editar
                      </button>
                      <div id="edit-user" uk-modal="true">
                        <div className="uk-modal-dialog uk-modal-body">
                          <h2 className="uk-modal-title">Editar Usuario</h2>
                          <form
                            className="uk-grid-small"
                            uk-grid="true"
                            onSubmit={handleEdit}
                          >
                            <InputField
                              name="nombre"
                              title="Nombre Completo"
                              placeholder="Nombre y apellidos"
                              value={user.nombre || ""}
                              handleChange={handleChange}
                              required
                            />
                            <InputField
                              name="email"
                              title="Email"
                              placeholder="email"
                              value={user.email || ""}
                              handleChange={handleChange}
                              required
                            />
                            <InputField
                              name="celular"
                              title="Cel"
                              placeholder="Cel (10 digitos)"
                              value={user.celular || ""}
                              handleChange={handleChange}
                              required
                            />
                            <InputField
                              name="password"
                              title="Password"
                              placeholder="Password"
                              value={user.password || ""}
                              handleChange={handleChange}
                              required
                            />
                            <InputField
                              name="rol"
                              title="Rol"
                              placeholder="Admin, Cliente, Vendedor"
                              value={user.vista || ""}
                              handleChange={handleChange}
                            />
                            <TextAreaField
                              name="comentarios"
                              title="Comentarios"
                              placeholder="Agrega comentarios"
                              value={user.comentarios || ""}
                              handleChange={handleChange}
                            />
                          </form>
                          <p className="uk-text-right">
                            <button
                              className="uk-button uk-button-default uk-modal-close"
                              type="button"
                            >
                              Cancel
                            </button>
                            <button
                              className="uk-button uk-button-primary uk-modal-close"
                              type="button"
                              onClick={handleEdit}
                            >
                              Crear
                            </button>
                          </p>
                        </div>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </Section>
    </div>
  );
};

export default Lotes;
