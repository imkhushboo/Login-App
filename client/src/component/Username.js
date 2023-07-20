import React, { useContext, useEffect } from 'react';
import { Link, useNavigate } from "react-router-dom";
import avatar from "../assets/avatar.png";
import styles from "../styles/Username.module.css";
import { useFormik } from 'formik';
import { usernamevalidate } from '../helper/UsernameVerify';
import { Toaster, toast } from 'react-hot-toast';
import helperContext from '../context/helperContext'


const Username = () => {
    const { authenticate, profile, setProfile } = useContext(helperContext);

    const navigate = useNavigate();
    const formik = useFormik({
        initialValues: {
            'username': profile.name || '',

        },
        validateOnBlur: false,
        validateOnChange: false,
        validate: usernamevalidate,
        onSubmit: async values => {
            console.log(values.username);
            const { status, data } = await authenticate(values.username);
            if (status != 200) {
                toast.error("Usern not found");
            }
            else {
                setProfile({ ...profile, name: values.username });
                navigate('/password');

            }
        },
    })
    return (
        <div className="container mx-auto">
            <Toaster position="top-center" reverseOrder={true} ></Toaster>
            <div className="flex justify-center items-center h-screen">
                <div className={styles.glass}>
                    <div className="title flex flex-col">
                        <h4 className="text-3xl text-center font-bold">Hello Again!!!</h4>
                        <span className="py-4 text-xl text-center text-gray-500">Explore the world with us!!!</span>
                        <form className="py-1" onSubmit={formik.handleSubmit}>
                            <div className="profile flex justify-center py-4">
                                <img className={styles.profile_img} src={avatar} alt="avatar" />
                            </div>
                            <div className="textbox flex flex-col">
                                <input {...formik.getFieldProps('username')} className={styles.textbox} type="text" placeholder="Username" />
                                <button className={styles.btn} type="submit">Let's Go!!!</button>
                            </div>
                            <div className="text-center">
                                <span className="text-gray-500">Not a member<Link to="/register" className="text-red-500">Register </Link></span>
                            </div>

                        </form>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Username
