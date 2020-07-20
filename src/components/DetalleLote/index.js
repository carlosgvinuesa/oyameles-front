import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Section from "~commons/Section";
import { fetchVentas, editVenta, createVenta } from "~redux/VentaDuck";
import { fetchLotes, editLote } from "~redux/LoteDuck";
import { fetchPagos, createPago } from "~redux/PagoDuck";
import { fetchUsers } from "~redux/UserDuck";
import { denormalizeData, currencyFormat } from "../../utils/formatters";
import { useParams } from "react-router-dom";
import Slider from "~commons/Slider";
import InputField from "~commons/form/InputField";
import * as dayjs from "dayjs";

const Ventas = () => {
  const dispatch = useDispatch();
  const { id } = useParams();
  const ventas = useSelector((state) => state.ventas.items);
  const pagos = useSelector((state) => state.pagos.items);
  const users = useSelector((state) => state.users.items);
  const lote = useSelector((state) => state.lotes.items[id]) || {};
  const [creditoData, setCreditoData] = useState({});
  const [tabla, setTabla] = useState([]);
  const [cliente, setCliente] = useState({});
  const [vendedor, setVendedor] = useState({});

  // const lote = denormalizeData(lotes).find((x) => x._id === id) || {};
  const venta = denormalizeData(ventas).find((x) => x.lote._id === id) || {};

  console.log(ventas, users);

  const detalleCredito = (propiedad) =>
    venta.detalle_credito === undefined ? "" : venta.detalle_credito[propiedad];

  useEffect(() => {
    dispatch(fetchVentas());
    dispatch(fetchPagos());
    dispatch(fetchUsers());
    dispatch(fetchLotes(id));
    if (ventas) {
      let pagosProyectados = corridaCredito(
        detalleCredito("pago_mensual"),
        detalleCredito("meses"),
        detalleCredito("fecha_inicial"),
        detalleCredito("principal"),
        detalleCredito("tasa")
      );
      setCreditoData({
        pago_mensual: detalleCredito("pago_mensual"),
        meses: detalleCredito("meses"),
        años: detalleCredito("años"),
        fecha_inicial: detalleCredito("fecha_inicial"),
        principal: detalleCredito("principal"),
        tasa: detalleCredito("tasa"),
        enganche_$: detalleCredito("enganche_$"),
        "enganche_%": detalleCredito("enganche_%"),
      });
      setTabla(pagosProyectados);
      setCliente(venta.client || "No hay cliente definido");
      setVendedor(venta.vendedor || "No hay vendedor definido");
    }
  }, [dispatch, id]);

  const handleSubmit = (e) => {
    e.preventDefault();
    let pagosProyectados = corridaCredito(
      creditoData["pago_mensual"],
      creditoData["meses"],
      creditoData["fecha_inicial"],
      creditoData["principal"],
      creditoData["tasa"]
    );
    setTabla(pagosProyectados);
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

  const calcularCredito = (key, value) => {
    let {
      enganche_$,
      principal,
      meses,
      tasa_mes = 0,
      pago_mensual,
    } = creditoData;

    if (key === "enganche_%") {
      enganche_$ = (value / 100) * lote.precio_total;
      principal = lote.precio_total - enganche_$;
      setCreditoData((prevState) => ({
        ...prevState,
        enganche_$,
        principal,
      }));
    }
    if (creditoData["tasa"] !== "") {
      tasa_mes = creditoData["tasa"] / 100 / 12;
      setCreditoData((prevState) => ({
        ...prevState,
        tasa_mes,
      }));
    }
    if (key === "años") {
      meses = value * 12;
      setCreditoData((prevState) => ({
        ...prevState,
        meses,
      }));
    }

    if (key === "tasa" || key === "enganche_%" || key === "años") {
      pago_mensual =
        (principal * tasa_mes * Math.pow(1 + tasa_mes, meses)) /
        (Math.pow(1 + tasa_mes, meses) - 1);
      setCreditoData((prevState) => ({
        ...prevState,
        pago_mensual,
      }));
    }
  };

  const handleChange = (e) => {
    const key = e.target.name;
    const value = e.target.files || e.target.value;
    setCreditoData((prevState) => ({
      ...prevState,
      [key]: value,
    }));
    calcularCredito(key, value);
  };

  const handleSelectors = (e) => {
    const key = e.target.name;
    const value = e.target.files || e.target.value;
    if(key === "cliente") setCliente(denormalizeData(users).find((x) => x.nombre === value));
    if(key === "vendedor") setVendedor(denormalizeData(users).find((x) => x.nombre === value));
    console.log("llave", key, "value", value, cliente);
  };

  const handleSubmit2 = (e) => {
    e.preventDefault();
  };
  const propiedad = (propiedad) =>
    propiedad === undefined || propiedad.length < 1
      ? "ND"
      : propiedad.join(", ");

  const corridaCredito = (pago, periodos, fecha, saldo, tasa) => {
    let i;
    let pagosArr = [
      {
        periodo: 0,
        fecha: dayjs(fecha).format("DD/MMM/YYYY"),
        saldo_inicial: 0,
        pago_mensual: 0,
        intereses: 0,
        principal: 0,
        saldo_final: Number(saldo),
        intereses_acumulados: 0,
      },
    ];

    for (i = 0; i < Number(periodos); i++) {
      pagosArr = [
        ...pagosArr,
        {
          periodo: i + 1,
          fecha: dayjs(pagosArr[i].fecha).add(1, "month").format("DD/MMM/YYYY"),
          saldo_inicial: pagosArr[i].saldo_final,
          pago_mensual: Number(pago),
          intereses: (pagosArr[i].saldo_final * (Number(tasa) / 100)) / 12,
          principal:
            Number(pago) -
            (pagosArr[i].saldo_final * (Number(tasa) / 100)) / 12,
          saldo_final:
            pagosArr[i].saldo_final -
            (Number(pago) -
              (pagosArr[i].saldo_final * (Number(tasa) / 100)) / 12),
          intereses_acumulados:
            (pagosArr[i].saldo_final * (Number(tasa) / 10)) / 12 +
            pagosArr[i].intereses_acumulados,
        },
      ];
    }
    return pagosArr;
  };

  return (
    <div>
      <Section>
        <h3>LOTE {lote.numero}</h3>
        <div
          className="uk-container uk-grid-match uk-child-width-1-3@m"
          uk-grid="true"
        >
          <div>
            <Slider images={lote.images} />
          </div>
          <div>
            <p>
              <b>Fase:</b> {lote.fase}
            </p>
            <p>
              <b>Área:</b> {currencyFormat(lote.area, "", 0)} M2
            </p>
            <p>
              <b>Precio por M2:</b> {currencyFormat(lote.precio_m2, "$", 0)}
            </p>
            <p>
              <b>Precio Total:</b> {currencyFormat(lote.precio_total, "$", 0)}
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
        <div className="uk-text-center" uk-grid="true">
          <div className="uk-width-1-2">
            <div className="uk-card uk-card-default uk-card-body uk-flex uk-flex-center uk-child-width-1">
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
                  type="number"
                  name="enganche_%"
                  title="Enganche (%)"
                  placeholder={detalleCredito("enganche_%")}
                  value={creditoData["enganche_%"] || ""}
                  handleChange={handleChange}
                />
                <InputField
                  name="tasa"
                  type="number"
                  title="Tasa (%)"
                  placeholder={detalleCredito("tasa")}
                  value={creditoData["tasa"] || ""}
                  handleChange={handleChange}
                />
                <InputField
                  name="años"
                  title="Años"
                  type="number"
                  placeholder={detalleCredito("años")}
                  value={creditoData["años"] || ""}
                  handleChange={handleChange}
                />
                <div className="uk-text-center" uk-grid="true">
                  <div className="uk-card uk-child-width-1-2">
                    <b>Enganche:</b>{" "}
                    {currencyFormat(creditoData["enganche_$"], "$", 0) || ""}
                  </div>
                  <br></br>
                  <div className="uk-card uk-child-width-1-2">
                    <b>Principal:</b>{" "}
                    {creditoData["principal"]
                      ? currencyFormat(creditoData["principal"], "$", 0)
                      : ""}
                  </div>
                  <br></br>
                  <div className="uk-card uk-child-width-1-2">
                    <b>Meses:</b> {creditoData["meses"] || ""}
                  </div>
                  <br></br>
                  <div className="uk-card uk-child-width-1-2">
                    <b>PAGO MENSUAL:</b>{" "}
                    {currencyFormat(creditoData["pago_mensual"], "$", 0) || ""}
                  </div>
                </div>
                <InputField
                  name="images"
                  title="Product images"
                  placeholder="Product images"
                  type="file"
                  handleChange={handleChange}
                  multiple
                />
                <button className="uk-button">Calcular Pagos</button>
              </form>
            </div>
          </div>
          <div className="uk-width-1-2 uk-height-match">
            <div className="uk-card uk-card-default uk-card-body">
              <form
                className="uk-form-horizontal uk-margin-large"
                onSubmit={handleSubmit2}
              >
                <div className="uk-margin">
                  <label
                    className="uk-form-label"
                    htmlFor="form-horizontal-select"
                  >
                    Cliente
                  </label>
                  <div className="uk-form-controls">
                    <select
                      className="uk-select"
                      id="form-horizontal-select"
                      name="cliente"
                      onChange={handleSelectors}
                    >
                      <option>
                        {cliente.nombre || "No hay cliente definido"}
                      </option>
                      {denormalizeData(users)
                        .sort((a, b) => a.periodo - b.periodo)
                        .map((user, index) => (
                          <option key={index}>{user.nombre}</option>
                        ))}
                    </select>
                    Email: {cliente.email}
                    <br></br>
                    Cel: {cliente.celular || ""}
                  </div>
                  <label
                    className="uk-form-label"
                    htmlFor="form-horizontal-select"
                  >
                    Vendedor
                  </label>
                  <div className="uk-form-controls">
                    <select
                      className="uk-select"
                      id="form-horizontal-select"
                      name="vendedor"
                      onChange={handleSelectors}
                    >
                      <option>
                        {vendedor.nombre || "No hay vendedor definido"}
                      </option>
                      {denormalizeData(users)
                        .sort((a, b) => a.periodo - b.periodo)
                        .map((user, index) => (
                          <option key={index}>{user.nombre}</option>
                        ))}
                    </select>
                    Email: {vendedor.email}
                    <br></br>
                    Cel: {vendedor.celular || ""}
                  </div>
                </div>
                <button className="uk-button">Guardar Cliente</button>
              </form>
            </div>
            <div className="uk-card uk-card-default uk-card-body">b</div>
          </div>
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
            {tabla
              .sort((a, b) => a.periodo - b.periodo)
              .map((pago, index) => (
                <tr key={index}>
                  <td>{pago.periodo}</td>
                  <td>{pago.fecha}</td>
                  <td>{currencyFormat(pago.saldo_inicial, "$", 0)}</td>
                  <td>{currencyFormat(pago.pago_mensual, "$", 0)}</td>
                  <td>{currencyFormat(pago.intereses, "$", 0)}</td>
                  <td>{currencyFormat(pago.principal, "$", 0)}</td>
                  <td>{currencyFormat(pago.saldo_final, "$", 0)}</td>
                  <td>{currencyFormat(pago.intereses_acumulados, "$", 0)}</td>
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
