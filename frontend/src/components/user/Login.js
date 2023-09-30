import axios from 'axios' //GoogleLogin
import React, { Fragment, useEffect, useState } from "react"; //GoogleLogin add useState
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { login, GoogleReactLogin, clearErrors } from "../../actions/userActions"; //GoogleLogin add GoogleReactLogin
import Loader from "../layout/Loader";
import MetaData from "../layout/MetaData";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useGoogleLogin } from "@react-oauth/google"; //GoogleLogin
import { FaGooglePlusG } from "react-icons/fa"; //GoogleLogin design icon

const Login = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  let location = useLocation();
  const { isAuthenticated, error, loading } = useSelector(
    (state) => state.auth
  );
  const redirect = new URLSearchParams(location.search).get("redirect");
  const [user, setUser] = useState([]); //GoogleLogin

  // useEffect(() => {
  //   if (isAuthenticated && redirect === "shipping") {
  //     navigate(`/${redirect}`, { replace: true });
  //   } else if (isAuthenticated) navigate("/");
  //   if (error) {
  //     // alert.error(error);
  //     dispatch(clearErrors());
  //   }
  // }, [dispatch, isAuthenticated, error, navigate, redirect]);

  const onSubmit = (data) => {
    dispatch(login(data.email, data.password));
  };

  //GoogleLogin

  useEffect(() => {
    if (isAuthenticated && redirect === "shipping") {
      // navigate(redirect.get('redirect'), {replace: true})

      navigate(`/${redirect}`, { replace: true });
    } else if (isAuthenticated) navigate("/");

    if (error) {
      // notify(error);
      dispatch(clearErrors());
    }

    if (user) {
      axios
        .get(
          `https://www.googleapis.com/oauth2/v1/userinfo?access_token=${user.access_token}`,
          {
            headers: {
              Authorization: `Bearer${user.access_token}`,
              Accept: "application/json",
            },
          }
        )
        .then((res) => {
          dispatch(GoogleReactLogin(res.data));
        })
        .catch((err) => console.log(err));
    }
  }, [dispatch, isAuthenticated, error, navigate, redirect, user]);

  const loginGoogle = useGoogleLogin({
    onSuccess: (codeResponse) => setUser(codeResponse),
    onError: (error) => console.log("Login Failed:", error),
  });
  // end of google login

  return (
    <Fragment>
      {loading ? (
        <Loader />
      ) : (
        <Fragment>
          <MetaData title={"Login"} />

          <div className="row wrapper">
            <div className="col-10 col-lg-5">
              <form className="shadow-lg" onSubmit={handleSubmit(onSubmit)}>
                  <center> <h1 className="mb-3">Login</h1></center>
                <div className="form-group">
                  <label htmlFor="email_field">Email</label>
                  <input
                    type="email"
                    id="email_field"
                    className={`form-control ${errors.email ? "is-invalid" : ""
                      }`}
                    {...register("email", { required: true })}
                  />
                  {errors.email && (
                    <div className="invalid-feedback">Email is required</div>
                  )}
                </div>
                <div className="form-group">
                  <label htmlFor="password_field">Password</label>
                  <input
                    type="password"
                    id="password_field"
                    className={`form-control ${errors.password ? "is-invalid" : ""
                      }`}
                    {...register("password", { required: true })}
                  />
                  {errors.password && (
                    <div className="invalid-feedback">Password is required</div>
                  )}
                </div>

                <center><Link to="/password/forgot">
                  Forgot Password?
                </Link></center>

                <button
                  id="login_button"
                  type="submit"
                  className="btn btn-block py-3"
                >
                  Login
                </button>
                <br/>
                  {/* <button id="login_button" type="submit" className="btn btn-block py-3" onClick={googlelogin}> <FcGoogle size={"2em"}/> Google Login</button> */}
                  <div style={{ display: "flex", alignItems: "center" }}>
                    <hr
                      style={{
                        flexGrow: 1,
                        border: "none",
                        borderTop: "1px solid black",
                      }}
                    />
                    <div
                      style={{
                        padding: "0 10px",
                        fontWeight: "bold",
                        fontSize: "18px",
                      }}>
                      or
                    </div>
                    <hr
                      style={{
                        flexGrow: 1,
                        border: "none",
                        borderTop: "1px solid black",
                      }}
                    />
                  </div>
                  <button id="login_button" type="submit" className="btn btn-block py-3" onClick={loginGoogle}>
                    <FaGooglePlusG size={"2em"} className="google-icon" /> <span className="google-text">Signin with google</span>
                  </button>
                <center><p>Don't have accout?</p></center>
                <center><Link to="/register" >
                  signup here?
                </Link></center>
              </form>
            </div>
          </div>
        </Fragment>
      )}
    </Fragment>
  );
};

export default Login;
