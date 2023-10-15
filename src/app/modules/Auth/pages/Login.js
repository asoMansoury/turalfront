import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import { connect } from "react-redux";
import { FormattedMessage, injectIntl } from "react-intl";
import * as auth from "../_redux/authRedux";
import { login } from "../_redux/authCrud";
import axios from 'axios';
import {AdminUserLoginApi} from '../../../pages/commonConstants/ApiConstants';
import * as Token from '../../../pages/_redux/Actions/TokenActions';
import { useDispatch, useSelector } from 'react-redux';
import WrongPasswordModal from './WrongPasswordModal';
const initialValues = {
  userName: "",
  password: "",
};

export function Login(props) {
  const { intl } = props;
  const [loading, setLoading] = useState(false);
  const tokenDispatch = useDispatch();
  const [showModal,setShowModal] = useState(false);
  const LoginSchema = Yup.object().shape({
    userName:Yup.string()
      .min(3,"حداقل سه کاراکتر")
      .required(
        intl.formatMessage({
          id: "AUTH.VALIDATION.REQUIRED_FIELD",
        })
      ),
    password: Yup.string()
      .min(3, "Minimum 3 symbols")
      .max(50, "Maximum 50 symbols")
      .required(
        intl.formatMessage({
          id: "AUTH.VALIDATION.REQUIRED_FIELD",
        })
      ),
  });

  const enableLoading = () => {
    setLoading(true);
  };

  const disableLoading = () => {
    setLoading(false);
  };

  const getInputClasses = (fieldname) => {
    if (formik.touched[fieldname] && formik.errors[fieldname]) {
      return "is-invalid";
    }

    if (formik.touched[fieldname] && !formik.errors[fieldname]) {
      return "is-valid";
    }

    return "";
  };

  const formik = useFormik({
    initialValues,
    validationSchema: LoginSchema,
    onSubmit: (values, { setStatus, setSubmitting }) => {
      enableLoading();
      setTimeout(() => {
        var data ={
          "UserName":values.userName,
          "Password":values.password
        }
        axios.post(AdminUserLoginApi,data).then((response)=>{
          if(response.data.hasError==false){
            console.log("Login",response.data.userDto)
            disableLoading();
            tokenDispatch(Token.Save_Token(response.data.userDto))
            setShowModal(false)
          }else{
            disableLoading();
            setShowModal(true);
            setSubmitting(false);
          }
        }).catch(() => {
          disableLoading();
          setSubmitting(false);
          setStatus(
            intl.formatMessage({
              id: "AUTH.VALIDATION.INVALID_LOGIN",
            })
          );
        });
      }, 1000);
    },
  });

  return (
    <div className="login-form login-signin" id="kt_login_signin_form">
      {/* begin::Head */}
      <div className="text-center mb-10 mb-lg-20">
      <h3 _ngcontent-ndw-c159=""  class="font-weight-bolder text-dark text-center font-size-h1 font-size-h1-lg mb-4"> ورود </h3>
        <span _ngcontent-ndw-c159="" class="font-weight-bold font-size-h6 text-dark-50"> نام کاربری و رمز عبور خود را وارد کنید </span>
      </div>
      {/* end::Head */}

      {/*begin::Form*/}
      <form
        onSubmit={formik.handleSubmit}
        className="form fv-plugins-bootstrap fv-plugins-framework"
      >
        {/* {formik.status ? (
          <div className="mb-10 alert alert-custom alert-light-danger alert-dismissible">
            <div className="alert-text font-weight-bold">{formik.status}</div>
          </div>
        ) : (
          <div className="mb-10 alert alert-custom alert-light-info alert-dismissible">
            <div className="alert-text ">
              Use account <strong>admin@demo.com</strong> and password{" "}
              <strong>demo</strong> to continue.
            </div>
          </div>
        )} */}
        {
          showModal==true?
            <WrongPasswordModal setShowModal={setShowModal} showModal={showModal}></WrongPasswordModal>
          :<></>
        }
        <div className="form-group fv-plugins-icon-container">
          <label _ngcontent-ndw-c159="" for="username" class="font-size-h6 font-weight-bolder text-dark">نام کاربری</label>
          <input
            placeholder=""
            type="userName"
            className={`form-control form-control-solid h-auto py-5 px-6 ${getInputClasses(
              "userName"
            )}`}
            name="userName"
            {...formik.getFieldProps("userName")}
          />
          {formik.touched.userName && formik.errors.userName ? (
            <div className="fv-plugins-message-container">
                            <div className="fv-help-block">نام کاربری خود را وارد نمایید.</div>
            </div>
          ) : null}
        </div>
        <div className="form-group fv-plugins-icon-container">
        <label _ngcontent-ndw-c159="" for="password" class="font-size-h6 font-weight-bolder text-dark pt-5"> رمز عبور </label>
          <input
            placeholder=""
            type="password"
            className={`form-control form-control-solid h-auto py-5 px-6 ${getInputClasses(
              "password"
            )}`}
            name="password"
            {...formik.getFieldProps("password")}
          />
          {formik.touched.password && formik.errors.password ? (
            <div className="fv-plugins-message-container">
              <div className="fv-help-block">پسورد خود را وارد نمایید.</div>
            </div>
          ) : null}
        </div>
        <div className="form-group d-flex flex-wrap justify-content-between align-items-center">
          {/* <Link
            to="/auth/forgot-password"
            className="text-dark-50 text-hover-primary my-3 mr-2"
            id="kt_login_forgot"
          >
            <FormattedMessage id="AUTH.GENERAL.FORGOT_BUTTON" />
          </Link> */}
          <button
            id="kt_login_signin_submit"
            type="submit"
            disabled={formik.isSubmitting}
            style={{backgroundImage: 'linear-gradient(to right, #6a75ca, #9666f7)'}}
            className={`btn btn-primary font-weight-bold px-9 py-4 my-3`}
          >
            <span>ورود</span>
            {loading && <span className="ml-3 spinner spinner-white"></span>}
          </button>
        </div>
      </form>
      {/*end::Form*/}
    </div>
  );
}

export default injectIntl(connect(null, auth.actions)(Login));
