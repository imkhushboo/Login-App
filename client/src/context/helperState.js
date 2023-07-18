import React, { useEffect, useState } from "react";
import helperContext from "./helperContext";
import axios from 'axios';
import jwt_decode from 'jwt-decode';
import env from "../"
axios.defaults.baseURL = process.env.REACT_APP_SERVER_DOMAIN;



const HelperState = (props) => {
    // const [username, setUsername] = useState("example@123");
    const [profile, setProfile] = useState({ "token": "", "name": "", "profile": "", "email": "", "firstname": "", "lastname": "", "mobile": "", "address": "", "isloading": true, "serverError": null, "status": undefined });
    useEffect(() => {
        const func = async (username) => {
            console.log(username);
            await getUser(username).then(({ data }) => {
                setProfile({
                    "name": data.username,
                    "profile": data.profile || '',
                    "email": data.email || '',
                    "firstname": data.firstname || '',
                    "lastname": data.lastname || '',
                    "mobile": data.mobile || '',
                    "address": data.address || '',
                    "isloading": false,
                    "status": 201,
                    "serverError": null

                })
                console.log(profile);
            }).catch(err => {

                console.log(err);
            })

        }

        if (profile.name !== "") {
            func(profile.name);
        }
        else {
            getUsername().then((response) => {
                setProfile({ ...profile, name: response.username });
            }).catch((err) => {
                console.log(err);
            })
        }


    }, [profile.name])


    const authenticate = async (username) => {
        var response;
        await axios.post(`/api/authenticate`, { username }).then((res) => {
            console.log(res);
            response = res;
        }).catch(err => {
            console.log(err);
            response = err.response;
        })
        console.log(response);
        return response;
    }


    const register = async (credentials) => {
        try {
            console.log(credentials);
            const { data: { msg }, status } = await axios.post(`api/register`, credentials, {
                headers: {
                    'Access-Control-Allow-Origin': "http://localhost:3001",
                    "Content-Type": "application/json",
                }
            });
            let { username, email } = credentials;

            if (status == 200) {
                const response = await axios.post(`/api/registerMail`, { username, useremail: email, subject: msg })
                console.log(response);
            }
            return Promise.resolve(msg);

        } catch (err) {
            return Promise.reject(err);
        }

    }

    const verifyPassword = async ({ username, password }) => {
        try {
            if (username) {
                const { data, status } = await axios.post('/api/login', { username, password });
                console.log(data, status);
                if (status != 200) {
                    Promise.reject({ error: "Wrong Password!!" });
                }
                return Promise.resolve({ data });

            }
        } catch (error) {
            return Promise.reject({ error: "Password doesn't Match...!" })
        }
    }



    const getUser = async (username) => {

        try {
            const { data } = await axios.get(`/api/user/${username}`).catch(err => {
                return Promise.reject({ err });
            });
            return { data };
        } catch (error) {
            return { error: "Password doesn't Match...!" }
        }

    }


    const getUsername = async (req, res) => {
        const token = localStorage.getItem('token')
        if (!token) return Promise.reject("error hogyi");
        let decode = jwt_decode(token);
        return decode;

    }

    const updateUser = async (response) => {
        try {
            console.log(response);
            const token = await localStorage.getItem('token');
            const data = await axios.put('/api/updateuser', response, { headers: { "Authorization": `Bearer ${token}` } });

            return Promise.resolve({ data })
        } catch (error) {
            return Promise.reject({ error: "Couldn't Update Profile...!" })
        }
    }


    const generateOTP = async (username) => {
        try {

            const { data: { code }, status } = await axios.get(`/api/generateOTP`, {
                params: {
                    username
                }
            });

            // send mail with the OTP
            if (status === 201) {
                let { data: { email } } = await getUser(username);
                console.log(email);
                let text = `Your Password Recovery OTP is ${code}. Verify and recover your password.`;
                await axios.post('/api/registerMail', { username, useremail: email, text, subject: "Password Recovery OTP" })
            }
            return Promise.resolve(code);
        } catch (error) {
            return Promise.reject({ error });
        }
    }


    const verifyOTP = async ({ username, code }) => {
        try {
            const { data, status } = await axios.get('/api/verifyOTP', { params: { username, code } })
            return { data, status }
        } catch (error) {
            return Promise.reject(error);
        }
    }



    const resetPassword = async ({ username, password }) => {

        try {
            const { data, status } = await axios.put('/api/resetPassword', { username, password });
            setProfile({ ...profile, status: status, isloading: false, serverError: null });
            return Promise.resolve({ data, status })
        } catch (error) {
            setProfile({ ...profile, serverError: error })
            return Promise.reject({ error })
        }

    }


    return (
        <helperContext.Provider value={{ profile, setProfile, getUsername, authenticate, register, verifyPassword, getUser, updateUser, generateOTP, verifyOTP, resetPassword }}>
            {props.children}
        </helperContext.Provider>
    );
}

export default HelperState;