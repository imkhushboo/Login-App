import React, { useContext } from 'react';
import { toast } from 'react-hot-toast';
import helperContext from '../context/helperContext'


function usernameverify(error = {}, values) {

    if (!values.username) {
        error.username = toast.error('Username Required!!');
    }
    else if (values.username.includes(" ")) {
        error.username = toast.error('Invalid Username!');
    }

    return error;
}
export async function usernamevalidate(values) {
    const errors = usernameverify({}, values);
    return errors;
}
export async function passwordvalidate(values) {
    const errors = passwordverify({}, values);
    return errors;
}
function passwordverify(error = {}, values) {
    var lowerCaseLetters = /[a-z]/g;
    var upperCaseLetters = /[A-Z]/g;
    var numbers = /[0-9]/g;
    var specialchar = /[`!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/;
    // console.log(values);
    if (!values.password) {
        error.password = toast.error('Password Required!!');
    }
    else if (values.password.includes(" ")) {
        error.password = toast.error('Invalid Password!');
    }
    else if (!values.password.match(lowerCaseLetters)) {
        error.password = toast.error("must contain lower case letter")
    }

    // Validate capital letters
    else if (!values.password.match(upperCaseLetters)) {
        error.password = toast.error("must contain Upper case letter")
    }

    // Validate numbers
    else if (!values.password.match(numbers)) {
        error.password = toast.error("must contain numbers")

    }

    // Validate length
    else if (!values.password.length >= 8) {
        error.password = toast.error("must greater than letter")

    }
    else if (!specialchar.test(values.password)) {
        error.password = toast.error("must contain special character!")
    }
    return error;


}

function recoverpasswordverify(error = {}, values) {
    console.log(values);
    error = passwordverify(error, values);
    if (values.password !== values.cfmpassword) {
        error.exist = toast.error('Password must be same');
    }

    return error;
}
export async function recoverpasswordvalidate(values) {
    const errors = recoverpasswordverify({}, values);
    return errors;
}


function emailverify(error = {}, values) {
    console.log(values);
    if (!values.email) {
        error.email = toast.error('Email Required!!');
    }
    else if (values.email.includes(" ")) {
        error.email = toast.error('Invalid Email!');
    }
    else if (/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(values.email) === false) {
        error.email = toast.error('InValid Email address');
    }
    return error;

}


//register validation
function registerverify(error = {}, values) {
    // console.log(values);
    error = usernameverify(error, values);
    error = passwordverify(error, values);
    error = emailverify(error, values);
    return error;
}
export async function registervalidate(values) {
    const errors = registerverify({}, values);
    return errors;
}


/** validate profile page */
export async function profileValidation(values) {
    const errors = emailverify({}, values);
    return errors;
}