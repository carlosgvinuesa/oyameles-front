import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Section from "~commons/Section";
import { fetchVentas } from "~redux/VentaDuck";
import { fetchLotes } from "~redux/LoteDuck";
import { denormalizeData } from "../../utils/formatters";
import { useParams } from "react-router-dom";
import Slider from "~commons/Slider";
import InputField from "~commons/form/InputField";

const Ventas = () => {
  const dispatch = useDispatch();
  const { id } = useParams();
  const ventas = useSelector((state) => state.ventas.items);
  const lote = useSelector((state) => state.lotes.items[id]) || {};

  useEffect(() => {
    dispatch(fetchVentas());
    dispatch(fetchLotes(id));
  }, [dispatch, id]);

  // const lote = denormalizeData(lotes).find((x) => x._id === id) || {};
  const venta = denormalizeData(ventas).find((x) => x.lote._id === id) || {};

  const handleSubmit = (e) => {
    e.preventDefault();
    // const formData = new FormData();
    // for (let key in product) {
    //   if (key === "images") {
    //     for (let file of Array.from(product[key])) {
    //       formData.append(key, file);
    //     }
    //   } else {
    //     formData.append(key, product[key]);
    //   }
    // }
    // dispatch(createProduct(formData));
  };

  const handleChange = (e) => {
    const key = e.target.name;
    const value = e.target.files || e.target.value;
    // setVenta((prevState) => ({ ...prevState, [key]: value }));
  };

  const propiedad = (propiedad) =>
    propiedad === undefined || propiedad.length < 1
      ? "ND"
      : propiedad.join(", ");

  const detalleCredito = (propiedad) =>
    venta.detalle_credito === undefined ? "" : venta.detalle_credito[propiedad];
   
  const corridaCredito = (pago, periodos, fecha, saldo, tasa) => {
    let i;
    let pagos = [{
      periodo: 0,
      fecha: fecha,
      saldo_inicial: 0,
      pago_mensual: 0,
      intereses: 0,
      principal: 0,
      saldo_final: saldo,
      intereses_acumulados: 0,
    }]
    for (i = 0; i < periodos; i++) {
      pagos.push({
      periodo: i+1,
      fecha: pagos[i].fecha+1,
      saldo_inicial: pagos[i].saldo_final,
      pago_mensual: pago,
      intereses: pagos[i].saldo_final*(tasa/100)/12,
      principal: pago-(pagos[i].saldo_final*(tasa/100)/12),
      saldo_final: pagos[i].saldo_final-(pago-(pagos[i].saldo_final*(tasa/100)/12)),
      intereses_acumulados: (pagos[i].saldo_final*(tasa/10)/12)+pagos[i].intereses_acumulados,
      })
      }
      return pagos;
  }

  console.log("el credito", corridaCredito(55610.75,24,111,1205132.5,10))
     

  return (
    <div>
      <Section>
        <h3>LOTE {lote.numero}</h3>
        <div className="uk-grid-match uk-child-width-1-3@m" uk-grid="true">
          <div>
            <Slider images={lote.images} />
          </div>
          <div>
            <p>
              <b>Fase:</b> {lote.fase}
            </p>
            <p>
              <b>Área:</b> {lote.area} M2
            </p>
            <p>
              <b>Precio por M2:</b> {lote.precio_m2}
            </p>
            <p>
              <b>Precio Total:</b> {lote.precio_total}
            </p>
            <p>
              <b>Status:</b> {lote.status}
            </p>
          </div>
          <div>
            <p>
              <b>Colindancias:</b> {propiedad(lote.colindancias)}
            </p>
            <p>
              <b>Geometria:</b> {propiedad(lote.geometria)}
            </p>
            <p>
              <b>Topografia:</b> {propiedad(lote.topografia)}
            </p>
            <p>
              <b>Vegetación:</b> {propiedad(lote.vegetacion)}
            </p>
            <p>
              <b>Vista:</b> {propiedad(lote.vista)}
            </p>
          </div>
        </div>
      </Section>

      <Section>
        <h3>Detalle de venta del LOTE {lote.numero}</h3>
        <div className="uk-flex uk-flex-left uk-child-width-1">
          <form
            className="uk-grid-small"
            uk-grid="true"
            onSubmit={handleSubmit}
          >
            <InputField
              name="fecha_inicial"
              placeholder="Fecha Inicial"
              value={detalleCredito("fecha_inicial")}
              handleChange={handleChange}
            />
            <InputField
              name="enganche_$"
              placeholder="Enganche en $MXN"
              value={detalleCredito("enganche_$")}
              handleChange={handleChange}
            />
            <InputField
              name="enganche_%"
              placeholder="Enganche en %"
              value={detalleCredito("enganche_%")}
              handleChange={handleChange}
            />
            <InputField
              name="pricipal"
              placeholder="Principal"
              value={detalleCredito("principal")}
              handleChange={handleChange}
            />
            <InputField
              name="tasa"
              placeholder="Tasa (%)"
              value={detalleCredito("enganche_$")}
              handleChange={handleChange}
            />
            <InputField
              name="años"
              placeholder="Años"
              value={detalleCredito("años")}
              handleChange={handleChange}
            />
            <InputField
              name="meses"
              placeholder="Meses"
              value={detalleCredito("meses")}
              handleChange={handleChange}
            />
            <InputField
              name="pago_mensual"
              placeholder="Pago Mensual"
              value={detalleCredito("pago_mensual")}
              handleChange={handleChange}
            />
            <InputField
              name="images"
              placeholder="Product images"
              type="file"
              handleChange={handleChange}
              multiple
            />
            <button className="uk-button">Create</button>
          </form>
        </div>
      </Section>
      <Section>
      <table className="uk-table uk-table-middle uk-table-divider">
          <thead>
            <tr>
              <th className="uk-width-small">Periodo</th>
              <th>Fecha de Pago</th>
              <th>Saldo Inicial</th>
              <th>Pago Mensual</th>
              <th>Intereses</th>
              <th>Principal</th>
              <th>Saldo Final</th>
              <th>Interesas Acumulados</th>
            </tr>
          </thead>
          <tbody>
            {

                <tr>
                  <td>{lote.numero}</td>
                  <td>{lote.cliente}</td>
                  <td>{lote.area}</td>
                  <td>{lote.precio_m2}</td>
                  <td>{lote.precio_total}</td>
                  <td>{lote.status}</td>
                  <td>{lote.descripcion}</td>
                  <td></td>
                </tr>
              }
          </tbody>
        </table>
      </Section>
    </div>
  );
};

export default Ventas;
