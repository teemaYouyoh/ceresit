import React, { useEffect, useRef, useState } from "react"
import { useHistory } from 'react-router-dom';


const Header = () => {
  let history = useHistory();

  useEffect(() => {
  }, [])

  const onLogoClick = () => {
    history.push({
      pathname: '/',
    });
  }
  const onClickLogin = () => {
    history.push({
      pathname: '/login',
    });
  }

  return (
    <>
      <header className="w-100">
        <div className="header_wr f-r-c-e">

          <div className="header_logo f-r-c-c">
            <img src="/images/logo.png" alt="cerasit" onClick={onLogoClick} />
          </div>

          {
            window.location.pathname === "/" ?
              (
                <div id="login_button" className="header_login f-r-c-c">
                  <span className="login_text" onClick={onClickLogin}>
                    Войти
                  </span>
                </div>
              )
              :
              null
          }

          {/* VIDEO BLOCK ONLY */}
        </div>
      </header>
    </>
  );
}

export default Header;