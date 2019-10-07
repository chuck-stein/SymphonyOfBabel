import React, {useState} from 'react';
import {NavLink} from "react-router-dom";

const activeStyle = {
    textDecoration: 'underline'
};

const Nav = () => (
    <div>
        <nav>
            <ul>
                <NavLink exact to={'/'} activeStyle={activeStyle}>
                    <li>About</li>
                </NavLink>
                <NavLink to={'/browse'} activeStyle={activeStyle}>
                    <li>Browse</li>
                </NavLink>
                <NavLink to={'/search'} activeStyle={activeStyle}>
                    <li>Search</li>
                </NavLink>
                <NavLink to={'/random'} activeStyle={activeStyle}>
                    <li>Random</li>
                </NavLink>
            </ul>
        </nav>
    </div>
);

export default Nav;
