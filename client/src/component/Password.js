import React, { useContext, useState } from 'react';
import { Link, useNavigate } from "react-router-dom";
import avatar from "../assets/avatar.png";
import styles from "../styles/Username.module.css";
import { useFormik } from 'formik';
import { passwordvalidate } from '../helper/UsernameVerify';
import { Toaster, toast } from 'react-hot-toast';
import helperContext from '../context/helperContext'



const Password = () => {
    const { profile, verifyPassword } = useContext(helperContext);
    const navigate = useNavigate();
    const formik = useFormik({
        initialValues: {
            'password': '',

        },
        validateOnBlur: false,
        validateOnChange: false,
        validate: passwordvalidate,
        onSubmit: async values => {
            const response = verifyPassword({ username: profile.name, password: values.password });
            toast.promise(response, {
                loading: "logging up",
                success: "you are welcome!!",
                error: "wrong password"
            })
            response.then((res) => {
                localStorage.setItem('token', res.data.token);
                navigate('/profile');
            }).catch(err => {
                console.log(err);
            })


        },
    })
    if (profile.isloading === true) return <div>loading!!!</div>
    return (


        <div className="container mx-auto">
            <Toaster position="top-center" reverseOrder={true} ></Toaster>
            <div className="flex justify-center items-center h-screen">
                <div className={styles.glass}>
                    <div className="title flex flex-col">
                        <h4 className="text-3xl text-center font-bold">Hello {profile.name}</h4>
                        <span className="py-4 text-xl text-center text-gray-500">Explore the world with us!!!</span>
                        <form className="py-1" onSubmit={formik.handleSubmit}>
                            <div className="profile flex justify-center py-4">
                                <img className={styles.profile_img} src={profile.profile || avatar} alt="avatar" />
                            </div>
                            <div className="textbox flex flex-col">
                                <input {...formik.getFieldProps('password')} className={styles.textbox} type="password" placeholder="Password" />
                                <button className={styles.btn} type="submit">Sign In</button>
                            </div>
                            <div className="text-center">
                                <span className="text-gray-500">Forgot Password ? <Link to="/reset" className="text-red-500 mx-2">Recover Now </Link></span>
                            </div>

                        </form>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Password;
