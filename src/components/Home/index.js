import React from "react";

import Section from "~commons/Section";
const Home = () => {
  return (
    <Section>
      <div
        className="uk-height-medium uk-flex uk-flex-center uk-flex-middle uk-background-cover uk-light"
        data-src="https://eldiariodelaeducacion.com/ecoescuela-abierta/wp-content/uploads/sites/18/2018/03/bosque_pixabay.jpg"
        
        data-sizes="(min-width: 650px) 650px, 100vw"
        uk-img="true"
      >
      
        <h1>Background Image</h1>
      </div>
      <img data-src="https://eldiariodelaeducacion.com/ecoescuela-abierta/wp-content/uploads/sites/18/2018/03/bosque_pixabay.jpg" width="1800" height="1200" alt="" uk-img="true"></img>
    </Section>
  );
};

export default Home;
