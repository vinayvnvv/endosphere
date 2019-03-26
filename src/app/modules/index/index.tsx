import * as React from 'react';
import './index.css';
// import ReactPlayer from 'react-player';
import Modal from 'react-modal';
const video = require('./../../../assets/endosphere-teaser.mp4');

interface IState {
    modalIsOpen: boolean
}

export class Index extends React.Component<any, IState> {

    state: IState = {
        modalIsOpen: false
    };

    videoRef:any = React.createRef();

    componentDidMount() {
        setTimeout(() => {
            this.videoRef.current.play();
        }, 500);
    }

    onVideoEnd = () => {
        this.openModal();
    }

    closeModal = () => {
        this.setState({modalIsOpen: false});
    }

    openModal = () => {
        this.setState({modalIsOpen: true});
    }

    register = () => {
        console.log('register', this.props);
        this.closeModal();
        this.props.history.push('/register');
    }


    render() {
        return (
            <div className="Index">
                <div className="_banner">
                    <video autoPlay muted ref={this.videoRef} onEnded={this.onVideoEnd} controls style={{width: '100%', height: '100%'}}>
                        <source src={video} />
                    </video>
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
                        <div className="_ttl">Dear Doctor, do you wish to be part of Endosphere 2.0?</div>
                        <div className="_desc">It will take you to register for a campain.</div>
                        <div className="_actions">
                            <button className="btn is-light" onClick={this.closeModal}>
                                <i className="material-icons btn-icon-left">close</i>
                                <span>No</span>
                            </button>
                            <button className="btn" onClick={this.register}>
                                <i className="material-icons btn-icon-left">arrow_right_alt</i>
                                <span>Yes</span>
                            </button>
                        </div>
                    </div>
                </Modal>
            </div>
        );
    }
}
 