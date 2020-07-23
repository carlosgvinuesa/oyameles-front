import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Section from "~commons/Section";
import InputField from "~commons/form/InputField";
import TextAreaField from "~commons/form/TextAreaField";
import { fetchUsers, createUser } from "~redux/UserDuck";
import { fetchVentas } from "~redux/VentaDuck";
import { denormalizeData, currencyFormat } from "../../utils/formatters";
import { Link } from "react-router-dom";

const Lotes = () => {
  const dispatch = useDispatch();
  const lotes = useSelector((state) => state.lotes.items);
  const [nuevoUser, setNuevoUser] = useState({});

  useEffect(() => {
    dispatch(fetchUsers());
  }, [dispatch]);

  const handleSubmit = (e) => {
    e.preventDefault();
    let data = nuevoUser;

    const formData = new FormData();
    for (let key in data) {
      if (key === "images") {
        for (let file of Array.from(data[key])) {
          formData.append(key, file);
        }
      } else {
        formData.append(key, data[key]);
      }
    }
    dispatch(createUser(formData));
  };

  const handleChange = (e) => {
    const key = e.target.name;
    let value = e.target.files || e.target.value;
    
    setNuevoUser((prevState) => ({
      ...prevState,
      [key]: value,
    }));
  };

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
              onSubmit={handleSubmit}
            >
              <InputField
                name="nombre"
                title="Nombre Completo"
                placeholder="Nombre y apellidos"
                value={nuevoUser.nombre || ""}
                handleChange={handleChange}
                required
              />
              <InputField
                type="number"
                name="fase"
                title="Fase del Proyecto"
                placeholder="Fase del Proyecto"
                value={nuevoUser.fase || ""}
                handleChange={handleChange}
                required
              />
              <InputField
                name="area"
                type="number"
                title="Area en M2"
                placeholder="Area en M2"
                value={nuevoUser.area || ""}
                handleChange={handleChange}
                required
              />
              <InputField
                name="precio_m2"
                title="Precio por m2"
                type="number"
                placeholder="Precio por m2"
                value={nuevoLote.precio_m2 || ""}
                handleChange={handleChange}
                required
              />
              <InputField
                name="vista"
                title="Vista"
                placeholder="Vista (separa por comas)"
                value={nuevoLote.vista || ""}
                handleChange={handleChange}
              />
              <InputField
                name="topografia"
                title="Topografía"
                placeholder="Topografía (separa por comas)"
                value={nuevoLote.topografia || ""}
                handleChange={handleChange}
              />
              <InputField
                name="vegetacion"
                title="Vegetación"
                placeholder="Vegetación (separa por comas)"
                value={nuevoLote.vegetacion || ""}
                handleChange={handleChange}
              />
              <InputField
                name="orientacion"
                title="Orientación"
                placeholder="Orientación (separa por comas)"
                value={nuevoLote.orientacion || ""}
                handleChange={handleChange}
              />
              <InputField
                name="colindancias"
                title="Colindancias"
                placeholder="Colindancias (separa por comas)"
                value={nuevoLote.colindancias || ""}
                handleChange={handleChange}
              />
              <InputField
                name="geometria"
                title="Geometría"
                placeholder="Geometría (separa por comas)"
                value={nuevoLote.geometria || ""}
                handleChange={handleChange}
              />
              <TextAreaField
                name="descripcion"
                title="Descripción"
                placeholder="Agrega una breve descripción"
                value={nuevoLote.descripcion || ""}
                handleChange={handleChange}
              />
              <InputField
                name="images"
                title="Lote images"
                placeholder="Lote images"
                type="file"
                handleChange={handleChange}
                multiple
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
                onClick={handleSubmit}
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
                  <th className="uk-width-small">Numero</th>
                  <th>Fase</th>
                  <th>Status</th>
                  <th>Area(m2)</th>
                  <th>$/m2</th>
                  <th>Precio Total</th>
                  <th>Vista</th>
                  <th>Orientacion</th>
                  <th>Colindancias</th>
                </tr>
              </thead>
              <tbody>
                {denormalizeData(lotes)
                  .sort((a, b) => a.numero - b.numero)
                  .map((lote, index) => (
                    <tr key={index}>
                      <td>{lote.numero}</td>
                      <td>{lote.fase}</td>
                      <td>{lote.status}</td>
                      <td>{currencyFormat(lote.area, "", 0)}</td>
                      <td>{currencyFormat(lote.precio_m2, "$", 0)}</td>
                      <td>{currencyFormat(lote.precio_total, "$", 0)}</td>
                      <td>{lote.vista}</td>
                      <td>{lote.orientacion}</td>
                      <td>{lote.colindancias}</td>
                      <td>
                        <Link to={`/DetalleLote/${lote._id}`}>
                          <button
                            className="uk-button uk-button-default"
                            type="button"
                          >
                            Detalle
                          </button>
                        </Link>
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
