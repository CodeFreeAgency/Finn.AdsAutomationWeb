import React, { useState } from "react";
import "./index.css";
import { Link, useLocation } from "react-router-dom";
import Logo from "../../assets/images/logo.png";
import menuItems from "./menu.json";

const Sidebar = () => {
  const location = useLocation();
  const { pathname } = location;
  const splitLocation = pathname.split("/");
  const [openSubMenu, setOpenSubMenu] = useState<number | null>(null);

  function collapseMenu() {
    const ele = document.getElementById("sideMenubar");
    if (ele) {
      ele.classList.toggle("open");
    }
  }

  function toggleSubmenu(index: number, hasSubMenu: boolean | undefined) {
    if (hasSubMenu) {
      setOpenSubMenu((prevIndex) => (prevIndex === index ? null : index));
    }
  }

  return (
    <div id="sideMenubar" className="sidebar">
      <div className="header-wrapper">
        <div className="brand-logo-container">
          <img src={Logo} className="brand-logo" alt="Brand Logo" />
        </div>
      </div>
      <div>
        <nav>
          <ul className="menus">
            {menuItems.map((menu, index) => {
              const submenuList = menu.submenuList || [];
              const isActive = splitLocation[1] === menu.active;
              const isSubmenuOpen = openSubMenu === index;

              return (
                <li
                  className={`menu-items ${isActive ? "active" : ""} ${
                    menu.hasSubMenu ? "has-submenu" : ""
                  }`}
                  key={index}
                  onClick={() => toggleSubmenu(index, menu.hasSubMenu)}
                >
                  {isActive && <div className="active-indicator"></div>}
                  <Link to={menu.to} className="menu-link">
                    <i className={menu.icon}></i>
                    <span className="mb-1">{menu.name}</span>
                  </Link>
                  {menu.hasSubMenu && (
                    <ul
                      className={`submenu-dropdown ${
                        isSubmenuOpen ? "open" : ""
                      }`}
                    >
                      {submenuList.map((submenu, subIndex) => (
                        <li
                          className={`menu-items ${
                            splitLocation[2] === submenu.active ? "active" : ""
                          }`}
                          key={subIndex}
                        >
                          <Link to={submenu.to} className="submenu-link">
                            <span>{submenu.name}</span>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  )}
                </li>
              );
            })}
          </ul>
        </nav>
      </div>
    </div>
  );
};

export default Sidebar;
