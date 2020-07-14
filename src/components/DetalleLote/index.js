import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Section from "~commons/Section";
import { fetchVentas } from "~redux/VentaDuck";
import { fetchLotes } from "~redux/LoteDuck";
import { denormalizeData } from "../../utils/formatters";
import { useParams } from "react-router-dom";

const Ventas = () => {
  const dispatch = useDispatch();
  const ventas = useSelector((state) => state.ventas.items);
  const lotes = useSelector((state) => state.lotes.items);
  const { id } = useParams();

  useEffect(() => {
    dispatch(fetchVentas());
    dispatch(fetchLotes());
  }, [dispatch]);

  const lote = denormalizeData(lotes).find((x) => x._id === id);
  const venta = denormalizeData(ventas).find((x) => x.lote._id === id);

  // const handleClick = () => {};

  console.log(venta, lote);

  return (
    <Section>
    <div uk-container="true">
      <div>
        <div className="uk-h3">LOTE {lote.numero}</div>
        <div
          className="uk-position-relative uk-visible-toggle uk-light"
          tabIndex="-1"
          uk-slideshow="animation: fade"
        >
          <ul className="uk-slideshow-items">
          {lote.images !== undefined
        ? lote.images.map((image, index) => (
            <li key={index}>
              <img src={image} alt="" uk-cover="true" />
            </li>
          ))
        : ""}
          </ul>

          <a
            className="uk-position-center-left uk-position-small uk-hidden-hover"
            href="#"
            uk-slidenav-previous="true"
            uk-slideshow-item="previous"
          ></a>
          <a
            className="uk-position-center-right uk-position-small uk-hidden-hover"
            href="#"
            uk-slidenav-next="true"
            uk-slideshow-item="next"
          ></a>
        </div>
      </div>
      </div>
    </Section>
  );
};

export default Ventas;
