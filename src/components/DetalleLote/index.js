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
import TextAreaField from "~commons/form/TextAreaField";
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
  const [nuevoPago, setNuevoPago] = useState({});

  // const lote = denormalizeData(lotes).find((x) => x._id === id) || {};
  const venta = denormalizeData(ventas).find((x) => x.lote._id === id) || {};

  //Calculos de pagos
  const pagosHechos = denormalizeData(pagos).filter(
    (pago) => pago.venta._id === venta._id
  );
  const pagosHechosNumeros = pagosHechos.map((pago) => pago.numero_de_pago);

  const totalPagado =
    denormalizeData(pagosHechos).length < 1
      ? ""
      : denormalizeData(pagosHechos).reduce((a, b) => a + b.monto, 0);

  const porPagar = lote.precio_total - totalPagado;
  const ultimoPago = pagosHechos.find(
    (pago) => pago.numero_de_pago === Math.max(...pagosHechosNumeros)
  );
  const proximoPago = tabla.find(
    (pago) => pago.periodo === Math.max(...pagosHechosNumeros) + 1
  );
  console.log(ultimoPago);
  console.log(proximoPago);

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
    if (key === "cliente")
      setCliente(denormalizeData(users).find((x) => x.nombre === value));
    if (key === "vendedor")
      setVendedor(denormalizeData(users).find((x) => x.nombre === value));
  };

  const guardarCambios = (e) => {
    e.preventDefault();
    let data = {
      tipo_de_venta: "Credito",
      vendedor: vendedor._id,
      fecha: creditoData.fecha_inicial,
      client: cliente._id,
      lote: lote._id,
      comentarios: "",
      ...creditoData,
    };
    if (creditoData["images"]) {
      data["images"] = creditoData["images"];
    }

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

    if (Object.keys(venta).length === 0) {
      dispatch(createVenta(formData));

      // 'htpps://'   || {src:'asdasd',seze:12}
      // if(typeof lote['images'] === 'string'){
      //   delete lote['images']
      // }
      dispatch(editLote({ status: "Vendido" }, lote._id));
    } else {
      dispatch(editVenta(formData, venta._id));
    }
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

  const submitNuevoPago = (e) => {
    e.preventDefault();
    let data = nuevoPago;

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
    dispatch(createPago(formData));
  };

  const handleNuevoPago = (e) => {
    const key = e.target.name;
    let value = e.target.files || e.target.value;
    setNuevoPago((prevState) => ({
      ...prevState,
      [key]: value,
      venta: venta._id,
    }));
  };

  return (
    <div>
      <h1>LOTE {lote.numero}</h1>
      <Section>
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
        <div
          className="uk-text-center"
          uk-grid="true"
          uk-height-match="target: > div > .uk-card"
        >
          <div className="uk-width-1-2">
            <div className="uk-card uk-card-default uk-card-body uk-flex uk-flex-center uk-child-width-1">
              <form
                className="uk-grid-small uk-flex uk-flex-center uk-child-width-1-2"
                uk-grid="true"
                onSubmit={handleSubmit}
              >
                <br></br>
                <InputField
                  name="fecha_inicial"
                  title="Fecha Inicial"
                  type="date"
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
                <InputField
                  name="images"
                  title="Product images"
                  placeholder="Product images"
                  type="file"
                  handleChange={handleChange}
                  multiple
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
                <button className="uk-button">Calcular Pagos</button>
              </form>
            </div>
          </div>
          <div className="uk-width-1-2 uk-height-match">
            <div className="uk-card uk-card-default uk-card-body">
              <div className="uk-card uk-card-default uk-card-body">
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
              </div>
              <div className="uk-card uk-card-default uk-card-body">
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
              <div className="uk-card uk-card-default uk-card-body">
                <h5>Pagos</h5>
                Total pagado:
                {currencyFormat(totalPagado, "$", 0)}
                <br></br>
                Por pagar: {currencyFormat(porPagar, "$", 0)}
                <br></br>
                {/* Empieza el modal de Agregar Pago */}
                <button
                  className="uk-button uk-button-default uk-margin-small-right"
                  type="button"
                  uk-toggle="target: #nuevo-pago"
                >
                  Agregar Pago
                </button>
                <div id="nuevo-pago" uk-modal="true">
                  <div className="uk-modal-dialog uk-modal-body">
                    <h2 className="uk-modal-title">Agregar nuevo pago</h2>
                    <form
                      className="uk-grid-small"
                      uk-grid="true"
                      onSubmit={submitNuevoPago}
                    >
                      <InputField
                        name="numero_de_pago"
                        type="number"
                        title="Numero de Pago"
                        placeholder="Numero de pago"
                        value={nuevoPago.numero_de_pago || ""}
                        handleChange={handleNuevoPago}
                        required
                      />
                      <InputField
                        name="monto"
                        type="number"
                        title="Monto"
                        placeholder="Monto"
                        value={nuevoPago.monto || ""}
                        handleChange={handleNuevoPago}
                        required
                      />
                      <InputField
                        name="fecha"
                        type="date"
                        title="fecha"
                        placeholder="fecha"
                        value={nuevoPago.fecha || ""}
                        handleChange={handleNuevoPago}
                        required
                      />
                      <InputField
                        name="medio_de_pago"
                        title="Medio de Pago"
                        placeholder="Medio de Pago"
                        value={nuevoPago.medio_de_pago || ""}
                        handleChange={handleNuevoPago}
                        required
                      />

                      <TextAreaField
                        name="comentarios"
                        title="Comentarios"
                        placeholder="Agrega comentarios"
                        value={nuevoPago.comentarios || ""}
                        handleChange={handleNuevoPago}
                      />
                      <InputField
                        id="comprobante"
                        name="images"
                        title="Comprobante"
                        placeholder="Comprobante"
                        type="file"
                        handleChange={handleNuevoPago}
                        multiple
                      />
                    </form>
                    <p className="uk-text-right">
                      <button
                        className="uk-button uk-button-default uk-modal-close"
                        type="button"
                      >
                        Cancelar
                      </button>
                      <button
                        className="uk-button uk-button-primary uk-modal-close"
                        type="button"
                        onClick={submitNuevoPago}
                      >
                        Crear
                      </button>
                    </p>
                  </div>
                </div>
                {/* Fin de modal de Agregar Pago */}
                {/* Empieza el modal de Detalle de Pagos */}
                <button
                  className="uk-button uk-button-default uk-margin-small-right"
                  type="button"
                  uk-toggle="target: #ver-pagos"
                >
                  Ver Pagos
                </button>
                <div id="ver-pagos" uk-modal="true">
                  <div className="uk-modal-dialog uk-modal-body">
                    <h2 className="uk-modal-title">Lista de pagos</h2>
                    Ultimo pago :
                    {ultimoPago === undefined ? (
                      ""
                    ) : (
                      <div className="uk-card uk-card-default uk-card-body">
                        Pago: {ultimoPago.numero_de_pago}
                        <br></br>
                        Fecha: {dayjs(ultimoPago.fecha).format("DD/MMM/YYYY")}
                        <br></br>
                        Monto: {currencyFormat(ultimoPago.monto, "$", 0)}
                      </div>
                    )}
                    Proximo pago :
                    {proximoPago === undefined ? (
                      ""
                    ) : (
                      <div className="uk-card uk-card-default uk-card-body">
                        Pago: {proximoPago.periodo}
                        <br></br>
                        Fecha: {dayjs(proximoPago.fecha).format("DD/MMM/YYYY")}
                        <br></br>
                        Monto:{" "}
                        {currencyFormat(proximoPago.pago_mensual, "$", 0)}
                      </div>
                    )}
                    Todos los pagos hechos :
                    {pagosHechos
                      .sort((a, b) => a.numero_de_pago - b.numero_de_pago)
                      .map((pago, index) => (
                        <div
                          key={index}
                          className="uk-card uk-card-default uk-card-body"
                        >
                          Pago: {pago.numero_de_pago}
                          <br></br>
                          Fecha: {dayjs(pago.fecha).format("DD/MMM/YYYY")}
                          <br></br>
                          Monto: {currencyFormat(pago.monto, "$", 0)}
                        </div>
                      ))}
                    <p className="uk-text-right">
                      <button
                        className="uk-button uk-button-default uk-modal-close"
                        type="button"
                      >
                        Cerrar
                      </button>
                    </p>
                  </div>
                </div>
                {/* Fin de modal de detalle de pagos */}
              </div>
            </div>
          </div>
          <div className="uk-margin">
            {/* Inicia modal de guardar cambios */}
            <button
              className="uk-button uk-button-default uk-margin-small-right"
              type="button"
              uk-toggle="target: #guardar-cambios"
            >
              Guardar Cambios
            </button>
            <div id="guardar-cambios" uk-modal="true">
              <div className="uk-modal-dialog uk-modal-body">
                <h2 className="uk-modal-title">Guardar Cambios</h2>
                <p>Estas seguro de que quieres guardar los cambios?</p>
                <p className="uk-text-right">
                  <button
                    className="uk-button uk-button-default uk-modal-close"
                    type="button"
                  >
                    Cancelar
                  </button>
                  <button
                    className="uk-button uk-button-primary uk-modal-close"
                    type="button"
                    onClick={guardarCambios}
                  >
                    Confirmar
                  </button>
                </p>
              </div>
            </div>
            {/* Termina modal de guardar cambios */}
          </div>
        </div>
      </Section>

      <Section>
        <div className="uk-overflow-auto">
          <table className="uk-table uk-table-middle uk-table-divider uk-table-striped table uk-table-small">
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
                  <tr
                    key={index}
                    style={
                      pagosHechos
                        .map((pago) => pago.numero_de_pago)
                        .includes(pago.periodo)
                        ? { backgroundColor: "#bee6c2" }
                        : {}
                    }
                  >
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
        </div>
      </Section>
    </div>
  );
};

export default Ventas;
