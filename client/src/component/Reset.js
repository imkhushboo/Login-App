import React, { useContext, useEffect } from 'react';
import { Link, Navigate, useNavigate } from "react-router-dom";
import avatar from "../assets/avatar.png";
import styles from "../styles/Username.module.css";
import { useFormik } from 'formik';
import { recoverpasswordvalidate } from '../helper/UsernameVerify';
import { Toaster, toast } from 'react-hot-toast';
import helperContext from '../context/helperContext'

const Reset = () => {
    const { generateOTP, profile, verifyOTP } = useContext(helperContext);
    const navigate = useNavigate();
    useEffect(() => {
        const response = generateOTP(profile.name);
        toast.promise(response, {
            loading: 'sending OTP',
            success: "OTP send to your email!",
            error: "can't generate OTP"
        });
    }, [profile.name])

    const formik = useFormik({
        initialValues: {
            'otp': '',

        },
        validateOnBlur: false,
        validateOnChange: false,

        onSubmit: async values => {
            let response = verifyOTP({ username: profile.name, code: values.otp });
            toast.promise(response, {
                success: "Successful",
                error: "Incorrect OTP"
            });
            response.then(() => {
                navigate('/recovery');
            })
        },
    })
    const handleReset = () => {
        const response = generateOTP(profile.name);
        toast.promise(response, {
            loading: 'sending OTP',
            success: "OTP send to your email!",
            error: "can't generate OTP"
        });
    }

    if (profile.isloading) return <h1 className='text-2xl font-bold'>isLoading</h1>;
    if (profile.servererror) return <h1 className='text-xl text-red-500'>{profile.serverError.message}</h1>
    if (profile.status && profile.status !== 201) return <Navigate to={'/password'} replace={true}></Navigate>

    return (
        <div className="container mx-auto">
            <Toaster position="top-center" reverseOrder={true} ></Toaster>
            <div className="flex justify-center items-center h-screen">
                <div className={styles.glass}>
                    <div className="title flex flex-col py-4">
                        <h4 className="text-3xl text-center font-bold">Recovery </h4>
                        <span className="py-4 text-xl text-center text-gray-500">Enter OTP to recover password.</span>
                        <form className="py-1" onSubmit={formik.handleSubmit}>
                            <div className="textbox flex flex-col">
                                <span className="py-4 text-sm text-center text-gray-500">Enter 6 digit OTP sent to your mobile no.</span>
                                <input {...formik.getFieldProps('otp')} className={styles.textbox} type="text" placeholder="OTP" />
                                <button className={styles.btn} type="submit">Recover</button>
                            </div>
                            <div className="text-center">
                                <span className="text-gray-500">Can't get OTP? <Link onClick={handleReset} className="text-red-500">Resend</Link></span>
                            </div>

                        </form>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Reset
