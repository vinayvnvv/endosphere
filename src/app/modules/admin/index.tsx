import * as React from 'react';
import { BrowserRouter, Switch, Route } from "react-router-dom";
import { Download } from './download';

export class Admin extends React.Component {
    render() {
        return(
            <BrowserRouter basename='/admin'>
                <Switch>
                    <Route path="/download" component={Download}/>
                </Switch>
            </BrowserRouter>
        );
    }
}