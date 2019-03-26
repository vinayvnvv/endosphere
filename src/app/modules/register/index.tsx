import * as React from 'react';
import './index.css';
import { Http } from './../../../services'
import Modal from 'react-modal';


interface IState {
    screen: string;
    formVars: IFormVars;
    formErrors: any;
    otpType: 'mobile' | 'email';
    loading: boolean;
    retrying: boolean;
    verified: boolean;
    otpCode: string;
    isInValidOtp: boolean;
    modalIsOpen: boolean;
}
interface IFormVars {
    name: string;
    email: string;
    phone: any;
    isSameAsWhatsapp: boolean;
    whatsappNumber: any;
}

export class Register extends React.Component<any, IState> {
    state: IState = {
        screen: 'details',
        formVars: {name: '', email: '', phone: '', isSameAsWhatsapp: false, whatsappNumber: ''},
        formErrors: {},
        otpType: 'mobile',
        loading: false,
        retrying: false,
        verified: false,
        otpCode: '',
        isInValidOtp: false,
        modalIsOpen: true
    }

    isFormSubmit: boolean;
    otpType: 'mobile' | 'email' = 'mobile';

    goToScreen = (screen: string) => {
        if(screen === 'otp') {
            this.isFormSubmit = true;
            const valid: boolean = this.validateForm();
            if(!valid) {
                return;
            } else {
                this.findOtpType();
                this.sendOtp();
            }
        } else {
            this.setState({screen});
        }
    }


    closeModal = () => {
        this.setState({modalIsOpen: false});
    }

    findOtpType = () => {
        if(this.state.formVars.email !== '') {
            this.otpType = 'email';
        } else {
            this.otpType = 'mobile';
        }
        this.setState({otpType: this.otpType});
    }


    validateForm = () => {
        if(!this.isFormSubmit) return false;
        console.log(this.state.formVars);
        const formErrors = {};
        let error = false;
        if(this.state.formVars.name === '') {
            error = true;
            formErrors['name'] = 'Name is Required!';
        }
        if(this.state.formVars.email !== '') {
            if(!this.state.formVars.email.match(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)) {
                error = true;
                formErrors['email'] = "Email is invalid!";
            }
        }
        if(this.state.formVars.phone) {
            if(!this.state.formVars.phone.match(/^\d{10}$/)) {
                error = true;
                formErrors['phone'] = 'Mobile Number is invalid!, Should be 10 digit number.'
            }
        }
        if(!this.state.formVars.isSameAsWhatsapp && this.state.formVars.whatsappNumber !== '') {
            if(!this.state.formVars.whatsappNumber.match(/^\d{10}$/)) {
                error = true;
                formErrors['whatsappNumber'] = 'Whatspp Mobile Number is invalid!, Should be 10 digit number.'
            }
        }

        if(this.state.formVars.phone === '') {
            error = true;
            formErrors['phone'] = 'Mobile Number is Required for Verfication!';
        }
        
        this.setState({
            formErrors
        });
        return !error;
    }

    onChangeFormVars = (field, e) => {
        const formVars = this.state.formVars;
        const value = (field === 'isSameAsWhatsapp' ? e.target.checked : e.target.value);
        formVars[field] = value;
        this.setState({formVars}, () => {
            this.validateForm();
        });
    }

    sendOtp = () => {
        this.setState({loading: true});
        Http.sendSmsOtp(this.state.formVars.phone)
            .then((res) => {
                console.log(res);
                this.setState({loading: false, screen: 'otp'});
            })
            .catch((err) => {
                console.log(err);
                this.setState({loading: false});
            })
    }

    reSendOtp = () => {
        this.setState({retrying: true});
        Http.retrySmsOtp(this.state.formVars.phone)
        .then((res) => {
            console.log(res);
            this.setState({retrying: false, screen: 'otp'});
        })
        .catch((err) => {
            console.log(err);
            this.setState({retrying: false});
        })
    }

    verfifyOtp = () => {
        this.setState({loading: true});
        Http.verifySmsOtp(this.state.formVars.phone, this.state.otpCode)
        .then((res) => {
            console.log(res);
            if(res.data.type === 'success' && res.data.message === 'otp_verified') {
                this.addUser();
            } else {
                this.setState({isInValidOtp: true, loading: false});
            }
        })
        .catch((err) => {
            console.log(err);
            this.setState({loading: false});
        })
    }


    addUser = () => {
        Http.addUser(this.state.formVars)
            .then((res) => {
                this.setState({verified: true, loading: false});
            }).catch((err) => {
                this.setState({loading: false});
            })
    }

    onChangeOtpCode = (e) => {
        this.setState({otpCode: e.target.value, isInValidOtp: false});
    }

    render() {
        return(
            <div className="Register">
                <div className="_box">
                    {!this.state.verified && (
                        <div className="_ttl">
                            {this.state.screen === 'details' ? 'Register For a Campaign' : 'Enter Otp'}
                        </div>
                    )}
                    {this.state.screen === 'details' && (
                        <div className="_form-container slideToRight">
                            <div className="form-item">
                                <div className="_label">Name: <small>(required)</small></div>
                                <div className="_field">
                                    <input className="input" 
                                           placeholder="Enter Name" 
                                           autoFocus={true} 
                                           value={this.state.formVars.name}
                                           onChange={this.onChangeFormVars.bind(this, 'name')}/>
                                </div>
                                {this.state.formErrors['name'] && (
                                    <div className="_error">{this.state.formErrors['name']}</div>
                                )}
                            </div>

                            <div className="form-item">
                                <div className="_label">Email:</div>
                                <div className="_field">
                                    <input className="input" 
                                           placeholder="Enter Email Address"
                                           value={this.state.formVars.email}
                                           onChange={this.onChangeFormVars.bind(this, 'email')}/>
                                </div>
                                {this.state.formErrors['email'] && (
                                    <div className="_error">{this.state.formErrors['email']}</div>
                                )}
                            </div>

                            <div className="form-item">
                                <div className="_label">Phone: <small>(required)</small></div>
                                <div className="_field">
                                    <input className="input" 
                                           placeholder="Enter Mobile Number"
                                           value={this.state.formVars.phone}
                                           maxLength={10}
                                           onChange={this.onChangeFormVars.bind(this, 'phone')}/>
                                </div>
                                {this.state.formErrors['phone'] && (
                                    <div className="_error">{this.state.formErrors['phone']}</div>
                                )}
                                <div className="_field-2">
                                    <label>
                                        <input type="checkbox" 
                                               checked={this.state.formVars.isSameAsWhatsapp}
                                               onChange={this.onChangeFormVars.bind(this, 'isSameAsWhatsapp')}/>
                                        This number is same as whatsapp number
                                    </label>
                                </div>
                            </div>

                            {!this.state.formVars.isSameAsWhatsapp && (
                                <div className="form-item">
                                    <div className="_label">Whatsapp Number:</div>
                                    <div className="_field">
                                        <input className="input" 
                                            placeholder="Enter Whatspp number"
                                            value={this.state.formVars.whatsappNumber}
                                            onChange={this.onChangeFormVars.bind(this, 'whatsappNumber')}/>
                                    </div>
                                    {this.state.formErrors['whatsappNumber'] && (
                                        <div className="_error">{this.state.formErrors['whatsappNumber']}</div>
                                    )}
                                </div>
                            )}
                            
                            {this.state.formErrors['other'] && (
                                <div className="error-content">{this.state.formErrors['other']}</div>
                            )}

                            <div className="_actions">
                                <button 
                                    className="btn" 
                                    disabled={this.state.loading}
                                    onClick={this.goToScreen.bind(this, 'otp')}>{this.state.loading ? 'Sending Otp' : 'Next'}</button>
                            </div>

                        </div>
                    )}

                    {this.state.screen === 'otp' && !this.state.verified && (
                        <div className="_form-container slideToLeft">
                            <div className="_info">
                                {!this.state.retrying && (
                                    <span>
                                        OTP sent to &nbsp;
                                        <b>{this.state.formVars.phone}.</b> &nbsp;
                                    </span>
                                )}
                                
                                <a 
                                    className={"link" + (this.state.retrying ? " disabled " : '')}
                                    onClick={this.reSendOtp}>{this.state.retrying ? "Sending.." : 'Resend Otp'}
                                </a>
                            </div>
                            <div className="form-item">
                                <div className="_label">Enter OTP:</div>
                                <div className="_field">
                                    <input className="input" maxLength={4} placeholder="Enter Otp" value={this.state.otpCode} onChange={this.onChangeOtpCode} />
                                </div>
                                {this.state.isInValidOtp && (
                                <div className="error-content">OTP entered in incorrect!</div>
                            )}

                            </div>

                            <div className="_actions">
                                <button 
                                    className="btn is-light" 
                                    onClick={this.goToScreen.bind(this, 'details')}>Back</button>
                                &nbsp; &nbsp;
                                <button 
                                    className={"btn" + (this.state.otpCode.length !== 4 || this.state.loading ? ' disabled ' : '')}
                                    onClick={this.verfifyOtp}>
                                        {this.state.loading ? 'Verifying..' : 'Verify'}
                                </button>
                            </div>
                        </div>
                    )}


                    {this.state.verified && (
                        <div className="_verify-screen">
                            <div className="_icon"><i className="material-icons">check_circle_outline</i></div>
                            <div className="_ttl">Verfied!</div>
                        </div>
                    )}
                    
                    
                </div>
                <Modal
                    isOpen={this.state.modalIsOpen}
                    onRequestClose={this.closeModal}
                    className={'dialog'}
                    contentLabel="Example Modal"
                    overlayClassName={'dialog-overlay'}
                    shouldCloseOnOverlayClick={false}
                    ariaHideApp={false}
                    >

                    <div className="dialog-msg">
                        <div className="_ttl">I provide my consent to be part of the Endosphere 2.0 and receive content in email or SMS/WhatsApp format messages</div>
                        <div className="_actions">
                            <button className="btn" onClick={this.closeModal}>
                                <span>OK</span>
                            </button>
                        </div>
                    </div>
                </Modal>
            </div>
        );
    }
}