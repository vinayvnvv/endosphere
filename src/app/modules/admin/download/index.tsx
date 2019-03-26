import * as React from 'react';
import { ENV } from './../../../../env';
import { Http } from './../../../../services';
const fileDownload = require('js-file-download');

export class Download extends React.Component {

    componentDidMount() {
        this.askPassword();
        this.toggleStyles(true);
    }


    toggleStyles(hide: boolean) {
        const className: string = 'none';
        const el = document.getElementsByClassName('app-header')[0];
        if(el) {
            if(hide) el.classList.add(className);
            else el.classList.remove(className);
        }
    }

    componentWillUnmount() {
        this.toggleStyles(false);
    }

    downloadFile = () => {
        Http.getUserXls()
        .then((res) => {
            fileDownload(res.data, this.createFileName() + '.xlsx');
        }).catch((err) => {
            console.log(err);
            alert("Server Error!");
        })
    
    }

    createFileName = () => {
        const date = new Date();
        let name = '';
        name += date.getMonth() + "-";
        name += date.getDate() + "-";
        name += date.getFullYear() + "-";
        name += date.getHours() + "_";
        name += date.getMinutes() + "_";
        name += date.getSeconds();
        return name;
    }

    askPassword = () => {
        const promptRef = prompt('Please Enter admin password');
        if(promptRef === ENV.ADMIN_PASSWORD) {
            console.log('success');
            this.downloadFile();
        } else {
            alert('Password is invalid, Try Again!');
            this.askPassword();
        }
    }
    render() {
        return(
            <div className="text-center"><h1>Downloading File....</h1></div>
        );
    }
}