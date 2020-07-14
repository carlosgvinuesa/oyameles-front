import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Section from "~commons/Section";
import { fetchLotes } from "~redux/LoteDuck";
import { denormalizeData } from "../../utils/formatters";
import { Link } from "react-router-dom";

const Lotes = () => {
  const dispatch = useDispatch();
  const lotes = useSelector((state) => state.lotes.items);

  useEffect(() => {
    dispatch(fetchLotes());
  }, [dispatch]);

  // const handleClick = () => {};

  console.log(denormalizeData(lotes));

  return (
    <Section>
      <div>
        <table className="uk-table uk-table-middle uk-table-divider">
          <thead>
            <tr>
              <th className="uk-width-small">Numero</th>
              <th>Cliente</th>
              <th>Area(m2)</th>
              <th>$/m2</th>
              <th>Precio Total</th>
              <th>Status</th>
              <th>Descripcion</th>
            </tr>
          </thead>
          <tbody>
            {denormalizeData(lotes)
              .sort((a, b) => a.numero - b.numero)
              .map((lote, index) => (
                <tr key={index}>
                  <td>{lote.numero}</td>
                  <td>{lote.cliente}</td>
                  <td>{lote.area}</td>
                  <td>{lote.precio_m2}</td>
                  <td>{lote.precio_total}</td>
                  <td>{lote.status}</td>
                  <td>{lote.descripcion}</td>
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
    </Section>
  );
};

export default Lotes;
