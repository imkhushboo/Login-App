import React, { useContext, useEffect } from 'react';
import { Link, useNavigate } from "react-router-dom";
import avatar from "../assets/avatar.png";
import styles from "../styles/Username.module.css";
import { useFormik } from 'formik';
import { profileValidation } from '../helper/UsernameVerify';
import { Toaster, toast } from 'react-hot-toast';
import convertToBase64 from '../helper/convert';
import extend from '../styles/Profile.module.css';
import helperContext from '../context/helperContext'





const Profile = () => {
    const { profile, setProfile, updateUser } = useContext(helperContext);
    const navigate = useNavigate();
    // const token = localStorage.getItem(token);
    useEffect(() => {

        console.log(profile);
        formik.setValues(profile);
    }, [profile.email])
    const formik = useFormik({
        initialValues: {
            'firstname': profile.firstname || '',
            'lastname': profile.lastname || '',
            'mobile': profile.mobile || '',
            'address': profile.address || '',
            'email': profile.email || ''

        },
        validateOnBlur: false,
        validateOnChange: false,
        validate: profileValidation,
        onSubmit: async values => {
            console.log(values);
            let response = updateUser({ ...values, profile: profile.profile });
            toast.promise(response, {
                loading: "Updating..",
                success: "Update successfully!!",
                error: "Error detected"
            })

        },
    })


    /** formik doensn't support file upload so we need to create this handler */
    const onUpload = async e => {
        const base64 = await convertToBase64(e.target.files[0]);
        setProfile({ ...profile, profile: base64 });
    }

    const logOut = async () => {
        localStorage.removeItem('token');
        navigate('/');
    }
    return (
        <div className="container mx-auto ">
            <Toaster position="top-center" reverseOrder={true} ></Toaster>
            <div className="flex justify-center items-center h-screen ">
                <div className={styles.glass}>
                    <div className="title flex flex-col items-center">
                        <h4 className="text-3xl text-center font-bold">Profile</h4>
                        <span className="py-4 text-xl text-center text-gray-500">you can update your profile here!</span>
                        <form className="py-1" onSubmit={formik.handleSubmit}>
                            <div className="profile flex justify-center py-4">
                                <label htmlFor="profile">
                                    <img className={styles.profile_img} src={profile.profile || avatar} alt="avatar" />
                                </label>
                                <input onChange={onUpload} type="file" id='profile' name='profile' />
                            </div>
                            <div className="textbox flex flex-col items-center gap-6">
                                <div className="name flex w-3/4 gap-10">
                                    <input {...formik.getFieldProps('firstname')} className={`${styles.textbox} ${extend.textbox}`} name="firstname" type="text" placeholder='FirstName' />
                                    <input {...formik.getFieldProps('lastname')} className={`${styles.textbox} ${extend.textbox}`} name="lastname" type="text" placeholder='LastName' />
                                </div>

                                <div className="name flex w-3/4 gap-10">
                                    <input {...formik.getFieldProps('mobile')} className={`${styles.textbox} ${extend.textbox}`} name="mobile" type="text" placeholder='Mobile No.' />
                                    <input {...formik.getFieldProps('email')} className={`${styles.textbox} ${extend.textbox}`} name="email" type="email" placeholder='Email*' />
                                </div>


                                <input {...formik.getFieldProps('address')} className={`${styles.textbox} ${extend.textbox}`} name="address" type="text" placeholder='Address' />
                                <button className={styles.btn} type='submit'>Update</button>


                            </div>

                            <div className="text-center">
                                <span className="text-gray-500">Log Out !!<button onClick={logOut} className="text-red-500">Log out </button></span>
                            </div>

                        </form>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Profile
