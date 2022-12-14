import classNames from 'classnames/bind';
import Modal from 'react-modal';
import { useNavigate } from 'react-router-dom';
import styles from './Register.module.scss';
import Input from '../../components/Input/Input';
import { useState, useContext } from 'react';
import { isEmail, isEmail2, isFullName, isPassword, isRePassword, isUsername } from '../../ulities/Validations';
import axiosClient from '../../api/axiosClient';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckCircle } from '@fortawesome/free-solid-svg-icons';
import { AuthContext } from '../../context/AuthContext';

import Loading from '../../components/Loading/Loading';
import { Fragment } from 'react';
import { useRef } from 'react';
import Warning from '../../components/Loading/Warning';
import { useEffect } from 'react';
import axiosCilent from '../../api/axiosClient';

const cx = classNames.bind(styles);

const customStyles = {
    content: {
        padding: '0',
        top: '50%',
        left: '50%',
        right: 'auto',
        bottom: 'auto',
        marginRight: '-50%',
        transform: 'translate(-50%, -50%)',
    },
};

const Register = (props) => {
    const [isConfirm, setIsConfirn] = useState(false);
    const [modalWaring, setModalWarning] = useState(false);
    const { error, dispatch } = useContext(AuthContext);
    const [loading, setLoading] = useState(false);
    const [email, setEmail] = useState('');
    const [errEmail, setErrEmail] = useState('');
    const [fullName, setFullName] = useState('');
    const [errFullName, setErrFullName] = useState('');
    const [password, setPassword] = useState('');
    const [errPassword, setErrPassword] = useState('');
    const [rePassword, setRePassword] = useState('');
    const [errRePassword, setErrRePassword] = useState('');

    //----------------------new state chang ui register--------------------------//
    const [txtMail, setTxtMail] = useState('');
    const [txtErrMail, setTxtErrMail] = useState('');
    const [txtFullname, setTxtFullname] = useState('');
    const [txtErrFullname, setTxtErrFullname] = useState('');
    const [txtPassword, setTxtPassword] = useState('');
    const [txtErrPassword, setTxtErrPassword] = useState('');
    const [txtRePassword, setTxtRePassword] = useState('');
    const [txtErrRePassword, setTxtErrRePassword] = useState('');
    const [listUser, setListUser] = useState([]);

    useEffect(() => {
        const getUsers = async () => {
            const listUser = await axiosCilent.get('/zola/users');
            setListUser([...listUser]);
        };
        getUsers();
    }, []);

    const handleChangeEmail = (txtMail) => {
        console.log(txtMail);

        const reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
        if (txtMail.length === 0) {
            setTxtErrMail('Email kh??ng ???????c ????? tr???ng!');
            return false;
        } else {
            if (reg.test(txtMail) === false) {
                setTxtErrMail('Email kh??ng ????ng ?????nh d???ng!');
                return false;
            } else {
                //const listUser = await axiosCilent.get('/zola/users');
                for (let i = 0; i < listUser.length; i++) {
                    if (listUser[i].email === txtMail) {
                        setTxtErrMail('Email ???? t???n t???i!');
                        return false;
                    }
                }
                setTxtErrMail('');
                return true;
            }
        }
    };

    function removeAscent(str) {
        if (str === null || str === undefined) return str;
        str = str.toLowerCase();
        str = str.replace(/??|??|???|???|??|??|???|???|???|???|???|??|???|???|???|???|???/g, 'a');
        str = str.replace(/??|??|???|???|???|??|???|???|???|???|???/g, 'e');
        str = str.replace(/??|??|???|???|??/g, 'i');
        str = str.replace(/??|??|???|???|??|??|???|???|???|???|???|??|???|???|???|???|???/g, 'o');
        str = str.replace(/??|??|???|???|??|??|???|???|???|???|???/g, 'u');
        str = str.replace(/???|??|???|???|???/g, 'y');
        str = str.replace(/??/g, 'd');
        return str;
    }

    const handleChangeFullName = (txtFullname) => {
        const reg = /^[a-zA-Z ]{1,30}$/;
        if (txtFullname.length === 0) {
            setTxtErrFullname('H??? t??n kh??ng ???????c ????? tr???ng!');
            return false;
        } else {
            if (reg.test(removeAscent(txtFullname)) === false) {
                setTxtErrFullname('H??? v?? t??n kh??ng bao g???m ch??? s???, k?? t??? ?????c bi???t v?? t???i ??a 30 k?? t???');
                return false;
            } else {
                setTxtErrFullname('');
                return true;
            }
        }
    };

    const handleChangePassword = (txtPassword) => {
        const reg = /(?=(.*[0-9]))(?=.*[\!@#$%^&*()\\[\]{}\-_+=~`|:;"'<>,./?])(?=.*[a-z])(?=(.*[A-Z]))(?=(.*)).{8,}/;
        if (txtPassword.length === 0) {
            setTxtErrPassword('M???t kh???u kh??ng ???????c ????? tr???ng!');
            return false;
        } else {
            if (reg.test(txtPassword) === false) {
                setTxtErrPassword(
                    'M???t kh???u ph???i bao g???m c??? ch??? hoa, ch??? th?????ng, s???, k?? t??? ?????c bi???t v?? ??t nh???t 8 k??? t???.',
                );
                return false;
            } else {
                setTxtErrPassword('');
                return true;
            }
        }
    };

    const handleChangeRePassword = (txtRePassword) => {
        const reg = txtPassword;
        if (txtRePassword.length === 0) {
            setTxtErrRePassword('M???t kh???u kh??ng ???????c ????? tr???ng!');
        } else {
            if (!(reg === txtRePassword)) {
                setTxtErrRePassword('M???t kh???u kh??ng tr??ng kh???p!');
            } else {
                setTxtErrRePassword('');
                return true;
            }
        }
    };

    const navigate = useNavigate();

    let timerId = useRef();

    const [modalIsOpen, setModalIsOpen] = useState(false);

    const openModal = () => {
        setModalIsOpen(true);
    };

    const closeModal = () => {
        setModalIsOpen(false);
    };

    const register = async () => {
        const errEm = handleChangeEmail(txtMail);
        const errFn = handleChangeFullName(txtFullname);
        const errPw = handleChangePassword(txtPassword);
        const errRp = handleChangeRePassword(txtRePassword);
        console.log(errEm, errFn, errPw, errRp);
        try {
            if (errEm === true && errFn === true && errPw === true && errRp === true) {
                const user = { email: txtMail, password: txtPassword, fullName: txtFullname };
                setLoading(true);
                await axiosClient.post('/zola/auth/register', user);
                //dispatch({ type: 'LOGIN_SUCCESS', payload: res });
                setLoading(false);
                return true;
            } else {
                return;
            }
        } catch (error) {
            console.log(error);
        }
    };

    const handleRegister = async (e) => {
        let result = await register();
        if (result === true) {
            openModal();
            setLoading(true);
            timerId.current = setInterval(async () => {
                const login = async () => {
                    dispatch({ type: 'LOGIN_START' });
                    let userCredential = { email: txtMail, password: txtPassword };
                    try {
                        setLoading(true);
                        const res = await axiosClient.post('/zola/auth/login', userCredential);
                        dispatch({ type: 'LOGIN_SUCCESS', payload: res });
                        if (res !== null) {
                            clearInterval(timerId.current);
                            navigate('/');
                        }
                    } catch (error) {
                        dispatch({ type: 'LOGIN_FAILURE' });
                    }
                };
                login();
            }, 1000);
        }
        //console.log(txtMail, txtFullname, txtPassword, txtRePassword);
    };

    const handleConfirm = () => {
        setModalIsOpen(false);
        setIsConfirn(true);
    };
    return (
        <Fragment>
            {isConfirm && (
                <Loading
                    state={setIsConfirn}
                    stateW={setModalWarning}
                    usernameReg={txtMail.split('@')[0]}
                    mailReg={txtMail}
                />
            )}
            {modalWaring && <Warning modalWarning={modalWaring} />}
            <div className={cx('wrapper')}>
                <div className={cx('header')}>
                    <h2>
                        ????ng k?? t??i kho???n Zola
                        <br />
                        ????? k???t n???i v???i ???ng d???ng Zola Web
                    </h2>
                </div>
                <div className={cx('body')}>
                    {
                        <div className={cx('content')}>
                            <div className={cx('title')}>
                                <h2>????ng k??</h2>
                            </div>
                            <div className={cx('form-signin')}>
                                <div className={cx('form-control')}>
                                    <i className="bx bxs-envelope"></i>
                                    <input
                                        value={txtMail}
                                        type="text"
                                        className={cx('ipt')}
                                        placeholder="Email"
                                        autoComplete="off"
                                        onChange={(e) => {
                                            setTxtMail(e.target.value);
                                            handleChangeEmail(e.target.value);
                                        }}
                                        onKeyPress={(e) => {
                                            if (e.key === 'Enter') {
                                                handleRegister();
                                            }
                                        }}
                                    />
                                </div>
                                <span style={{ color: 'red', fontSize: 12 }}>{txtErrMail}</span>

                                <div className={cx('form-control')}>
                                    <i className="bx bxs-envelope"></i>
                                    <input
                                        value={txtFullname}
                                        type="text"
                                        className={cx('ipt')}
                                        placeholder="H??? v?? t??n"
                                        autoComplete="off"
                                        onChange={(e) => {
                                            setTxtFullname(e.target.value);
                                            handleChangeFullName(e.target.value);
                                        }}
                                        onKeyPress={(e) => {
                                            if (e.key === 'Enter') {
                                                handleRegister();
                                            }
                                        }}
                                    />
                                </div>
                                <span style={{ color: 'red', fontSize: 12 }}>{txtErrFullname}</span>
                                <div className={cx('form-control')}>
                                    <i className="bx bxs-lock"></i>
                                    <input
                                        value={txtPassword}
                                        type="password"
                                        className={cx('ipt')}
                                        placeholder="M???t kh???u"
                                        autoComplete="off"
                                        onChange={(e) => {
                                            setTxtPassword(e.target.value);
                                            handleChangePassword(e.target.value);
                                        }}
                                        onKeyPress={(e) => {
                                            if (e.key === 'Enter') {
                                                handleRegister();
                                            }
                                        }}
                                    />
                                    <br />
                                </div>
                                <span style={{ color: 'red', fontSize: 12 }}>{txtErrPassword}</span>
                                <div className={cx('form-control')}>
                                    <i className="bx bxs-lock"></i>
                                    <input
                                        value={txtRePassword}
                                        type="password"
                                        className={cx('ipt')}
                                        placeholder="Nh???p l???i m???t kh???u"
                                        autoComplete="off"
                                        onChange={(e) => {
                                            setTxtRePassword(e.target.value);
                                            handleChangeRePassword(e.target.value);
                                        }}
                                        onKeyPress={(e) => {
                                            if (e.key === 'Enter') {
                                                handleRegister();
                                            }
                                        }}
                                    />
                                    <br />
                                </div>
                                <span style={{ color: 'red', fontSize: 12 }}>{txtErrRePassword}</span>

                                <div style={{ padding: '4px' }}></div>
                                <button className={cx('btn-register')} onClick={handleRegister}>
                                    ????ng k??
                                </button>
                                {
                                    <Modal
                                        isOpen={modalIsOpen}
                                        style={customStyles}
                                        onRequestClose={closeModal}
                                        ariaHideApp={false}
                                    >
                                        <div className={cx('wrapper-modal')}>
                                            <div className={cx('content-modal')}>
                                                <FontAwesomeIcon
                                                    icon={faCheckCircle}
                                                    className={cx('icon-loading')}
                                                    style={{ color: 'green', fontSize: '25' }}
                                                />
                                                <div className={cx('text-confirm')}>
                                                    ????ng k?? th??nh c??ng. Vui l??ng x??c nh???n email ????? c?? th??? ????ng nh???p v??
                                                    s??? d???ng. Xin c???m ??n.
                                                </div>
                                            </div>
                                            <button className={cx('btn-confirm-mail')} onClick={handleConfirm}>
                                                X??c nh???n
                                            </button>
                                        </div>
                                    </Modal>
                                }
                            </div>
                        </div>
                    }
                </div>
            </div>
        </Fragment>
    );
};

export default Register;
