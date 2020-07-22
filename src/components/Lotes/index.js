import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Section from "~commons/Section";
import InputField from "~commons/form/InputField";
import TextAreaField from "~commons/form/TextAreaField";
import { fetchLotes, createLote } from "~redux/LoteDuck";
import { fetchVentas } from "~redux/VentaDuck";
import { denormalizeData, currencyFormat } from "../../utils/formatters";
import { Link } from "react-router-dom";

const Lotes = () => {
  const dispatch = useDispatch();
  const lotes = useSelector((state) => state.lotes.items);
  const [nuevoLote, setNuevoLote] = useState({});

  useEffect(() => {
    dispatch(fetchLotes())
    dispatch(fetchVentas());
  }, [dispatch]);

  const handleSubmit = (e) => {
    e.preventDefault();
    let data = nuevoLote;

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
    dispatch(createLote(formData));
  };

  const handleChange = (e) => {
    const key = e.target.name;
    let value = e.target.files || e.target.value;
    let precio_total = 0;
    if (nuevoLote.area > 0 && nuevoLote.precio_m2 > 0) {
      precio_total = nuevoLote.area * nuevoLote.precio_m2;
    }
    if (
      [
        "vista",
        "topografia",
        "vegetacion",
        "orientacion",
        "colindancias",
        "geometria",
      ].indexOf(key) > -1
    )
      value = value.split(",");
    setNuevoLote((prevState) => ({
      ...prevState,
      [key]: value,
      precio_total: precio_total,
    }));
  };

  console.log(nuevoLote);

  return (
    <Section>
      {/* Modal */}
      <button
        className="uk-button uk-button-default uk-margin-small-right"
        type="button"
        uk-toggle="target: #nuevo-lote"
      >
        Nuevo Lote
      </button>
      <div id="nuevo-lote" uk-modal="true">
        <div className="uk-modal-dialog uk-modal-body">
          <h2 className="uk-modal-title">Crear nuevo lote</h2>
          <form
            className="uk-grid-small"
            uk-grid="true"
            onSubmit={handleSubmit}
          >
            <InputField
              name="numero"
              title="Numero de Lote"
              placeholder="Numero de lote"
              value={nuevoLote.numero || ""}
              handleChange={handleChange}
              required
            />
            <InputField
              type="number"
              name="fase"
              title="Fase del Proyecto"
              placeholder="Fase del Proyecto"
              value={nuevoLote.fase || ""}
              handleChange={handleChange}
              required
            />
            <InputField
              name="area"
              type="number"
              title="Area en M2"
              placeholder="Area en M2"
              value={nuevoLote.area || ""}
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
  );
};

export default Lotes;
