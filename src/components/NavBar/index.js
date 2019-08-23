import React from 'react';
import './styles.css';

function Component() {
  return (
    <header className="container-full header">
      <nav className="container navbar">
        <div className="navbar__logo">
          <a href="/">
            <h2 className="spdLogo">
              <span className="onDesktop">
                Sistema de Prevenci&oacute;n de Desastres
              </span>
              <span className="onMovil">SPD</span>
            </h2>
          </a>
        </div>
        <div className="navbar__sponsors">
          <div className="sponsors__item">
            <a href="http://undc.edu.pe">
              <img
                src="/assets/images/undc-logo.png"
                className="sponsorLogo"
                alt="Universidad Nacional de Ca&ntilde;ete"
              />
            </a>
          </div>
          <div className="sponsors__item">
            <a href="https://www.mpfn.gob.pe">
              <img
                src="/assets/images/mpfn-logo.png"
                className="sponsorsLogo"
                alt="Ministerio P&uacute;blico Fiscalia de la Naci&oacute;n"
              />
            </a>
          </div>
        </div>
      </nav>
    </header>
  );
}

export default Component;
