import React, { useContext } from 'react';
import { Link, Navigate, useNavigate } from "react-router-dom";
import avatar from "../assets/avatar.png";
import styles from "../styles/Username.module.css";
import { useFormik } from 'formik';
import { recoverpasswordvalidate } from '../helper/UsernameVerify';
import { Toaster, toast } from 'react-hot-toast';
import helperContext from '../context/helperContext';
const Recovery = () => {
    const { profile, resetPassword } = useContext(helperContext);
    const navigate = useNavigate();
    const formik = useFormik({
        initialValues: {
            'password': '',
            'cfmpassword': ''

        },
        validateOnBlur: false,
        validateOnChange: false,
        validate: recoverpasswordvalidate,
        onSubmit: async values => {
            let response = resetPassword({ username: profile.name, password: values.password });
            toast.promise(response, {
                loading: "setting up!!",
                success: "Successful!!",
                error: "not able to set up"
            })
            response.then(() => {
                navigate('/password');
            })
        },
    })

    if (profile.isloading) return <h1 className='text-2xl font-bold'>isLoading</h1>;
    if (profile.serverError) return <h1 className='text-xl text-red-500'>{profile.serverError.message}</h1>
    if (profile.status && profile.status !== 201) return <Navigate to={'/password'} replace={true}></Navigate>
    return (
        <div className="container mx-auto">
            <Toaster position="top-center" reverseOrder={true} ></Toaster>
            <div className="flex justify-center items-center h-screen">
                <div className={styles.glass}>
                    <div className="title flex flex-col py-4">
                        <h4 className="text-3xl text-center font-bold">Recover Password  </h4>
                        <span className="py-4 text-xl text-center text-gray-500">Enter new password.</span>
                        <form className="py-1" onSubmit={formik.handleSubmit}>
                            <div className="textbox flex flex-col">

                                <input {...formik.getFieldProps('password')} className={styles.textbox} type="password" placeholder="Password" />
                                <input {...formik.getFieldProps('cfmpassword')} className={styles.textbox} type="password" placeholder="Confirm Password" />
                                <button className={styles.btn} type="submit">Reset Password</button>
                            </div>


                        </form>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Recovery
