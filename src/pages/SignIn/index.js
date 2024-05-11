import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './style.css';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import VisibilityOffOutlinedIcon from '@mui/icons-material/VisibilityOffOutlined';
import { Button, Snackbar } from '@mui/material';
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { app } from '../../firebase';
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';

const auth = getAuth(app);

const SignIn = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [showLoader, setShowLoader] = useState(false);
    const [formFields, setFormFields] = useState({
        email: '',
        password: '',
    });
    const [error, setError] = useState('');
    const history = useNavigate();
    const [snackbarOpen, setSnackbarOpen] = useState(false);

 
    const onChangeField = (e) => {
        const { name, value } = e.target;
        setFormFields({ ...formFields, [name]: value });
    }

  
    const isFormValid = () => {
        return formFields.email.trim() !== '' && formFields.password.trim() !== '';
    }

   
    const signIn = () => {
        if (!isFormValid()) {
            setError('Please fill out all fields.'); 
            return;
        }

        setShowLoader(true);
        signInWithEmailAndPassword(auth, formFields.email, formFields.password)
            .then((userCredential) => {
                setShowLoader(false);
                setFormFields({ email: '', password: '' });
                localStorage.setItem('isLogin', true);
                history('/');
            })
            .catch((error) => {
                setShowLoader(false);
                setError('Invalid email or password.');
            });
    }

   
    

  
    const handleCloseSnackbar = () => {
        setSnackbarOpen(false);
    }

    return (
        <>
            <section className='signIn mb-5'>
                <div className="breadcrumbWrapper">
                    <div className="container-fluid">
                        <ul className="breadcrumb breadcrumb2 mb-0">
                            <li><Link to="/">Home</Link></li>
                            <li>Sign In</li>
                        </ul>
                    </div>
                </div>

                <div className='loginWrapper'>
                    <div className='card shadow'>
                        <Backdrop
                            sx={{ color: '#000', zIndex: (theme) => theme.zIndex.drawer + 1 }}
                            open={showLoader}
                            className="formLoader"
                        >
                            <CircularProgress color="inherit" />
                        </Backdrop>

                        <h3>Sign In</h3>
                        <form className='mt-4'>
                            <div className='form-group mb-4 w-100'>
                        <TextField id="email" type="email" name='email' label="Email" className='w-100'
                            onChange={onChangeField} value={formFields.email} autoComplete='email' />
                    </div>
                            <div className='form-group mb-4 w-100'>
                        <div className='position-relative'>
                            <TextField id="password" type={showPassword ? 'text' : 'password'} name='password' label="Password" className='w-100'
                                onChange={onChangeField} value={formFields.password} autoComplete='current-password' />
                            <Button className='icon' onClick={() => setShowPassword(!showPassword)}>
                                {showPassword ? <VisibilityOffOutlinedIcon /> : <VisibilityOutlinedIcon />}
                            </Button>
                        </div>
                    </div>

                           {error && <div className="alert alert-danger" role="alert">{error}</div>}

                    <div className='form-group mt-5 mb-4 w-100'>
                        {/* The "Sign In" button is disabled if the form is not valid */}
                        <Button className='btn btn-g btn-lg w-100' onClick={signIn} disabled={!isFormValid()}>Sign In</Button>
                    </div>

                            <div className='form-group mt-5 mb-4 w-100 signInOr'>
                                <p className='text-center'>OR</p>
                                <Button className='w-100' variant="outlined" onClick={signInWithGoogle}>
                                    <img src={GoogleImg} alt="Google Logo" /> Sign In with Google
                                </Button>
                            </div>

                            <div className='form-group mt-3 mb-4 w-100'>
                                <Button className='btn btn-link' onClick={forgotPassword}>Forgot Password?</Button>
                            </div>

                            <p className='text-center'>Don't have an account? <b><Link to="/signup">Sign Up</Link></b></p>
                        </form>
                    </div>
                </div>
            </section>
            <Snackbar
                open={snackbarOpen}
                autoHideDuration={6000}
                onClose={handleCloseSnackbar}
                message="Password reset email sent!"
            />
        </>
    );
}

export default SignIn;
