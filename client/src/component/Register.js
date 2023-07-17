import React, { useContext, useState } from 'react';
import { Link, useNavigate } from "react-router-dom";
import avatar from "../assets/avatar.png";
import styles from "../styles/Username.module.css";
import { useFormik } from 'formik';
import { registervalidate } from '../helper/UsernameVerify';
import convertToBase64 from '../helper/convert';
import { Toaster, toast } from 'react-hot-toast';
import helperContext from '../context/helperContext'


const Register = () => {
    const { register } = useContext(helperContext);
    const [file, setFile] = useState()
    const navigate = useNavigate();
    const formik = useFormik({
        initialValues: {
            'username': '',
            'email': '',
            'password': '',

        },
        validateOnBlur: false,
        validateOnChange: false,
        validate: registervalidate,
        onSubmit: async values => {
            values = await Object.assign(values, { profile: file || '' });
            let response = register(values);
            toast.promise(response, {
                loading: 'Creating ',
                success: 'Registered Successfully',
                error: <b>Couldn't Register</b>,
            });
            response.then(() => {
                navigate('/');
            });

        },
    })

    /** formik doensn't support file upload so we need to create this handler */
    const onUpload = async e => {
        const base64 = await convertToBase64(e.target.files[0]);
        setFile(base64);
    }
    return (
        <div className="container mx-auto">
            <Toaster position="top-center" reverseOrder={true} ></Toaster>
            <div className="flex justify-center items-center h-screen">
                <div className={styles.glass}>
                    <div className="title flex flex-col">
                        <h4 className="text-3xl text-center font-bold">Register Yourself!!</h4>
                        <span className="py-4 text-xl text-center text-gray-500">Explore the world with us!!!</span>
                        <form className="py-1" onSubmit={formik.handleSubmit}>
                            <div className="profile flex justify-center py-4">
                                <label htmlFor="profile">
                                    <img src={file || avatar} className={styles.profile_img} alt="avatar" />
                                </label>

                                <input onChange={onUpload} type="file" id='profile' name='profile' />
                            </div>
                            <div className="textbox flex flex-col">
                                <input {...formik.getFieldProps('username')} className={styles.textbox} type="text" placeholder="Username" />
                                <input {...formik.getFieldProps('password')} className={styles.textbox} type="text" placeholder="Password" />
                                <input {...formik.getFieldProps('email')} className={styles.textbox} type="text" placeholder="Email" />
                                <button className={styles.btn} type="submit">Register</button>
                            </div>
                            <div className="text-center">
                                <span className="text-gray-500">Already Registered?<Link to="/" className="text-red-500 mx-1">Login page </Link></span>
                            </div>

                        </form>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Register
