import * as React from 'react';
import './index.css';
import { NavLink } from 'react-router-dom';
const logo = require('./../../../logo.png');

export const Header = () => (
    <div className="app-header">
        <div className="_left flex flex-align-center">
            <div className="_logo _item">
                <img src={logo} alt=""/>
            </div>
        </div>
        <div className="_right">
            <div className="_btns">
                <NavLink exact={true} to={'/'} activeClassName={'disabled no-transparent'} className="_item btn is-light transparent">Home</NavLink>
                <NavLink to={'/register'} activeClassName={'disabled no-transparent'} className="_item btn is-light transparent">Register</NavLink>
            </div>
        </div>
    </div>
);