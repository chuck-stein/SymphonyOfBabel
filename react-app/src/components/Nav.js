import React from "react";
import { NavLink } from "react-router-dom";

const navLinkStyle = ({ isActive }) =>
  isActive
    ? {
        textDecoration: "underline",
      }
    : undefined;

// The Nav component is a navigation bar for going to different section of the website.
const Nav = () => (
  <div>
    <nav>
      <ul>
        <NavLink to={"/"} style={navLinkStyle}>
          <li>About</li>
        </NavLink>
        <NavLink to={"/browse"} style={navLinkStyle}>
          <li>Browse</li>
        </NavLink>
        <NavLink to={"/search"} style={navLinkStyle}>
          <li>Search</li>
        </NavLink>
        <NavLink to={"/random"} style={navLinkStyle}>
          <li>Random</li>
        </NavLink>
      </ul>
    </nav>
  </div>
);

export default Nav;
