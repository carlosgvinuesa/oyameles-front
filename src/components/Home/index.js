import React from "react";
import Slider from "~commons/Slider";
import "./home.css";

const Home = () => {
  return (
    <div>
      <section className="logo title center">
        <div>OYAMELES</div>
      </section>
      <section>
        <div
          className="uk-child-width-1-2@s uk-child-width-1-3@m uk-child-width-1-4@l uk-text-center"
          uk-grid="masonry: true"
        >
          <div>
            <div className="uk-card uk-card-default uk-card-body">
              <h1>El Proyecto</h1>
              <p>
                OYAMELES es una comunidad en el bosque ubicada en el municipio
                de Ocuilan, Estado de México que tiene como misión regenerar el
                espacio en el que se encuentra y contribuir a la transformación
                del desarrollo inmobiliario mediante un modelo basado en
                prácticas regenerativas y sistemas colaborativos. La intención
                es crear un cambio de conciencia en las formas en que habitamos,
                consumimos y nos relacionamos, por medio de actividades
                recreativas, culturales, educativas, ecoturísticas y
                espirituales, que generen una cultura de prosperidad compartida.
                OYAMELES busca convertirse en un centro de intercambio de
                experiencias para compartir y difundir prácticas que logren
                generar una relación de unidad con la naturaleza, construir una
                comunidad sostenible e inspirar a futuras generaciones.
              </p>
            </div>
          </div>
          <div>
            <div className="uk-card uk-card-default uk-margin-top">
              <Slider
                images={[
                  "https://res.cloudinary.com/dwgevym2s/image/upload/v1595465417/oyameles/rnd2_gwvb0g.png",
                ]}
              />
            </div>
          </div>
          <div>
            <div className="uk-card uk-card-default uk-card-body">
              <h1>El Lugar</h1>
              <p>
                Mediante la observación y la interacción con el sitio, hemos
                logrado un entendimiento del lugar, de sus componentes y sus
                relaciones. Al reconocer la esencia que lo caracteriza,
                descubrimos su potencial. Oyameles cuenta con una gran
                diversidad biológica. El ecosistema del lugar es un bosque
                pino-encino con clima templado, de montaña donde predominan
                árboles de cedro, oyamel, encino y ocote. Tiene un clima
                templado semi húmedo (templado en el día y frío en la noche). La
                altitud máxima es de 3,100 msnm y la mínima de 2,900 msnm. El
                promedio de precipitación pluvial es de 1,800 – 2,000 mm
                anuales.
              </p>
            </div>
          </div>
          <div>
            <div className="uk-card uk-card-default">
              <Slider
                images={[
                  "https://res.cloudinary.com/dwgevym2s/image/upload/v1595465416/oyameles/rnd1_iqmugz.png",
                ]}
              />
            </div>
          </div>
          <div>
            <div className="uk-card uk-card-default">
              <Slider
                images={[
                  "https://res.cloudinary.com/dwgevym2s/image/upload/v1595463383/oyameles/ubicacion_ozycwu.png",
                ]}
              />
            </div>
          </div>
          <div>
            <div className="uk-card uk-card-default">
              <Slider
                images={[
                  "https://res.cloudinary.com/dwgevym2s/image/upload/v1595465386/oyameles/rnd10_zgvm4i.png",
                ]}
              />
            </div>
          </div>
          <div>
            <div className="uk-card uk-card-default">
              <Slider
                images={[
                  "https://res.cloudinary.com/dwgevym2s/image/upload/v1595465420/oyameles/el-lugar_tcgnj1.png",
                ]}
              />
            </div>
          </div>
          <div>
            <div className="uk-card uk-card-default uk-card-body">
              <Slider
                images={[
                  "https://res.cloudinary.com/dwgevym2s/image/upload/v1595465398/oyameles/oyaicon3_urlvrv.png",
                ]}
              />
              <h1>Sistema de Caminos y Senderos</h1>
              <p>
                El diseño de los caminos se adapta a las pendientes del terreno
                y al diseño hidrológico; el sistema se divide en caminos
                vehiculares y senderos peatonales. Los materiales que se
                utilizarán serán recursos locales para evitar alterar el
                ecosistema.{" "}
              </p>
              <p>
                Los senderos, que suman 5 km aproximadamente, rodean y
                atraviesan el terreno. Existirán espacios donde se contemplarán
                zonas de descanso y se crearán recorridos para caminatas
                contemplativas y deporte.
              </p>
            </div>
          </div>
          <div>
            <div className="uk-card uk-card-default">
              <Slider
                images={[
                  "https://res.cloudinary.com/dwgevym2s/image/upload/v1595465405/oyameles/oyameles1_mffcg0.png",
                ]}
              />
            </div>
          </div>
          <div>
            <div className="uk-card uk-card-default uk-card-body">
              <Slider
                images={[
                  "https://res.cloudinary.com/dwgevym2s/image/upload/v1595465394/oyameles/oyaicon1_m759wq.png",
                ]}
              />
              <h1>Bosque de Conservación</h1>
              <p>
                De acuerdo a las condiciones actuales del terreno, se reservaron
                las áreas mejor conservadas como zonas protegidas las cuales
                suman más de 5 hectáreas. En este espacio se podrá disfrutar del
                silencio del bosque, realizar caminatas contemplativas y
                descansar en zonas que tienen como objetivo conectar al usuario
                con el bosque y su biodiversidad.
              </p>
            </div>
          </div>
          <div>
            <div className="uk-card uk-card-default">
              <Slider
                images={[
                  "https://res.cloudinary.com/dwgevym2s/image/upload/v1595465386/oyameles/rnd11_tfh6g3.png",
                ]}
              />
            </div>
          </div>
          <div>
            <div className="uk-card uk-card-default uk-card-body">
              <Slider
                images={[
                  "https://res.cloudinary.com/dwgevym2s/image/upload/v1595465396/oyameles/oyaicon6_gnalaw.png",
                ]}
              />
              <h1>Vivero</h1>
              <p>
                Será un espacio para producir plantas de acuerdo a la paleta
                vegetal de la zona las cuales se utilizarán para la siembra de
                huertos, bosques comestibles, zonas de reforestación y los
                lotes.
              </p>
            </div>
          </div>
        </div>
      </section>
      <section></section>
    </div>
  );
};

export default Home;

