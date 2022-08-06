import React from 'react';
import {NavLink} from "react-router-dom";

// The CSS styling for when a link in the navigation bar is the currently active "page"
const activeStyle = {
    textDecoration: 'underline'
};

// The Nav component is a navigation bar for going to different section of the website.
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
