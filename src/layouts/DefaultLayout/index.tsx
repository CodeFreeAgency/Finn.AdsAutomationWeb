import React from 'react';
import Logo from "../../assets/brand/logo.svg";
import './index.css';
import Footer from '../../shared/Footer';
import Header from '../../shared/Header';
interface Props {
  children: React.ReactNode
}
const DefaultLayout: React.FunctionComponent<Props> = (props:Props) => {
   return (
  <>
    <div className="default-layout">
      <div className="header">
        <div className="login-log">
          <img src={Logo} alt="logo" />
        </div>
      </div>

      <div className="default-inner">
        <main>{props.children}</main>
      </div>

      {/* 👇 Add footer here */}
      <Footer />
    </div>
  </>
);

}
export default DefaultLayout;