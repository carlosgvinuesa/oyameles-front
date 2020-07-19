import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Section from "~commons/Section";
import { fetchVentas } from "~redux/VentaDuck";
import { fetchLotes } from "~redux/LoteDuck";
import { denormalizeData, currencyFormat } from "../../utils/formatters";
import { useParams } from "react-router-dom";
import Slider from "~commons/Slider";
import InputField from "~commons/form/InputField";
import * as dayjs from "dayjs";

const Ventas = () => {
  const dispatch = useDispatch();
  const { id } = useParams();
  const ventas = useSelector((state) => state.ventas.items);
  const lote = useSelector((state) => state.lotes.items[id]) || {};
  const [creditoData, setCreditoData] = useState({});
  const [payments, setPayments] = useState([]);

  // const lote = denormalizeData(lotes).find((x) => x._id === id) || {};
  const venta = denormalizeData(ventas).find((x) => x.lote._id === id) || {};

  const detalleCredito = (propiedad) =>
    venta.detalle_credito === undefined ? "" : venta.detalle_credito[propiedad];

  useEffect(() => {
    dispatch(fetchVentas());
    dispatch(fetchLotes(id));
    if (ventas) {
      let pagos = corridaCredito(
        detalleCredito("pago_mensual"),
        detalleCredito("meses"),
        detalleCredito("fecha_inicial"),
        detalleCredito("principal"),
        detalleCredito("tasa")
      );
      setCreditoData({
        pago_mesual: detalleCredito("pago_mensual"),
        meses: detalleCredito("meses"),
        años: detalleCredito("años"),
        fecha_inicial: detalleCredito("fecha_inicial"),
        principal: detalleCredito("principal"),
        tasa: detalleCredito("tasa"),
      });
      setPayments(pagos);
    }
  }, [dispatch, id ]);

  const handleSubmit = (e) => {
    e.preventDefault();
    let pagos = corridaCredito(
      creditoData["pago_mensual"],
      creditoData["meses"],
      creditoData["fecha_inicial"],
      creditoData["principal"],
      creditoData["tasa"]
    );
    setPayments(pagos);
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
    // dispatch(createVenta(formData));
  };

  const handleChange = (e) => {
    const key = e.target.name;
    const value = e.target.files || e.target.value;
    const meses = creditoData["años"] * 12;
    const tasa = creditoData["tasa"] / 100 / 12;
    const pagoMensual =
      (creditoData["principal"] *
        tasa *
        Math.pow(1 + tasa, creditoData["meses"])) /
      (Math.pow(1 + tasa, creditoData["meses"]) - 1);
    const enganche = (creditoData["enganche_%"] / 100) * lote.precio_total;
    const principal = lote.precio_total - creditoData["enganche_$"];
    setCreditoData((prevState) => ({
      ...prevState,
      [key]: value,
      meses: meses,
      pago_mensual: pagoMensual,
      enganche_$: enganche,
      principal: principal,
    }));
    console.log(creditoData, tasa, pagoMensual);
  };

  const propiedad = (propiedad) =>
    propiedad === undefined || propiedad.length < 1
      ? "ND"
      : propiedad.join(", ");

  const corridaCredito = (pago, periodos, fecha, saldo, tasa) => {
    let i;
    let pagos = [
      {
        periodo: 0,
        fecha: dayjs(fecha).format("DD/MMMM/YYYY"),
        saldo_inicial: 0,
        pago_mensual: 0,
        intereses: 0,
        principal: 0,
        saldo_final: Number(saldo),
        intereses_acumulados: 0,
      },
    ];

    for (i = 0; i < Number(periodos); i++) {
      pagos = [
        ...pagos,
        {
          periodo: i + 1,
          fecha: dayjs(pagos[i].fecha).add(1, "month").format("DD/MMMM/YYYY"),
          saldo_inicial: pagos[i].saldo_final,
          pago_mensual: Number(pago),
          intereses: (pagos[i].saldo_final * (Number(tasa) / 100)) / 12,
          principal:
            Number(pago) - (pagos[i].saldo_final * (Number(tasa) / 100)) / 12,
          saldo_final:
            pagos[i].saldo_final -
            (Number(pago) - (pagos[i].saldo_final * (Number(tasa) / 100)) / 12),
          intereses_acumulados:
            (pagos[i].saldo_final * (Number(tasa) / 10)) / 12 +
            pagos[i].intereses_acumulados,
        },
      ];
    }
    return pagos;
  };

  console.log(venta);

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
              title="Fecha Inicial"
              placeholder={detalleCredito("fecha_inicial")}
              value={creditoData["fecha_inicial"] || ""}
              handleChange={handleChange}
            />
            <InputField
              name="enganche_%"
              title="Enganche (%)"
              placeholder={detalleCredito("enganche_%")}
              value={creditoData["enganche_%"] || ""}
              handleChange={handleChange}
            />
            <InputField
              disabled
              name="enganche_$"
              title="Enganche ($MXN)"
              placeholder={detalleCredito("enganche_$")}
              value={creditoData["enganche_$"] || ""}
              handleChange={handleChange}
            />
            <InputField
              disabled
              name="principal"
              title="Principal"
              placeholder={detalleCredito("principal")}
              value={creditoData["principal"] ? creditoData["principal"] : ""}
              handleChange={handleChange}
            />
            <InputField
              name="tasa"
              title="Tasa (%)"
              placeholder={detalleCredito("tasa")}
              value={creditoData["tasa"] || ""}
              handleChange={handleChange}
            />
            <InputField
              name="años"
              title="Años"
              placeholder={detalleCredito("años")}
              value={creditoData["años"] || ""}
              handleChange={handleChange}
            />
            <InputField
              disabled
              name="meses"
              title="Meses"
              placeholder={detalleCredito("meses")}
              value={creditoData["meses"] || ""}
              handleChange={handleChange}
            />
            <InputField
              disabled
              name="pago_mensual"
              title="Pago Mensual"
              placeholder={detalleCredito("pago_mensual")}
              value={creditoData["pago_mensual"] || ""}
              handleChange={handleChange}
            />
            <InputField
              name="images"
              title="Product images"
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
        <table className="uk-table uk-table-middle uk-table-divider uk-table-striped table uk-table-small uk-table-responsive">
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
            {payments
              .sort((a, b) => a.periodo - b.periodo)
              .map((pago, index) => (
                <tr key={index}>
                  <td>{pago.periodo}</td>
                  <td>{pago.fecha}</td>
                  <td>{currencyFormat(pago.saldo_inicial, "$", 1)}</td>
                  <td>{currencyFormat(pago.pago_mensual, "$", 1)}</td>
                  <td>{currencyFormat(pago.intereses, "$", 1)}</td>
                  <td>{currencyFormat(pago.principal, "$", 1)}</td>
                  <td>{currencyFormat(pago.saldo_final, "$", 1)}</td>
                  <td>{currencyFormat(pago.intereses_acumulados, "$", 1)}</td>
                  <td></td>
                </tr>
              ))}
          </tbody>
        </table>
      </Section>
    </div>
  );
};

export default Ventas;
