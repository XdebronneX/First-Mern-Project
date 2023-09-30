import axios from 'axios' //GoogleLogin
import React, { Fragment, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import MetaData from "../layout/MetaData";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { registers, GoogleReactLogin, clearErrors } from "../../actions/userActions";
import { useGoogleLogin } from "@react-oauth/google"; //GoogleLogin
import { FaGooglePlusG } from "react-icons/fa"; //GoogleLogin design icon

const Register = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const [user, setUser] = useState({
    name: "",
    email: "",
    password: "",
  });

  const { name, email, password } = user;

  const [avatar, setAvatar] = useState("");
  const [avatarPreview, setAvatarPreview] = useState(
    "/images/default_avatar.jpg"
  );

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { isAuthenticated, error, loading } = useSelector(
    (state) => state.auth
  );

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/");
    }

    if (error) {
      // alert.error(error);
      dispatch(clearErrors());
    }
    // GoogleLogin
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

  }, [dispatch, isAuthenticated, error, navigate, user]); //add user for googlelogin

  const loginGoogle = useGoogleLogin({
    onSuccess: (codeResponse) => setUser(codeResponse),
    onError: (error) => console.log("Login Failed:", error),
  });
  // end of google login

  const submitHandler = (e) => {
    // e.preventDefault();
    const formData = new FormData();
    formData.set("name", name);
    formData.set("email", email);
    formData.set("password", password);
    formData.set("avatar", avatar);

    dispatch(registers(formData));
  };

  const onChange = (e) => {
    if (e.target.name === "avatar") {
      const reader = new FileReader();

      reader.onload = () => {
        if (reader.readyState === 2) {
          setAvatarPreview(reader.result);
          setAvatar(reader.result);
        }
      };

      reader.readAsDataURL(e.target.files[0]);
    } else {
      setUser({ ...user, [e.target.name]: e.target.value });
    }
  };

  return (
    <Fragment>
      <MetaData title={"Register User"} />
      <div className="row wrapper">
        <div className="col-10 col-lg-5">
          <form
            className="shadow-lg"
            onSubmit={handleSubmit(submitHandler)}
            encType="multipart/form-data"
          >
            <center><h1 className="mb-3">Register</h1></center>

            <div className="form-group">
              <label htmlFor="email_field">Name</label>
              <input
                type="name"
                id="name_field"
                className={`form-control ${errors.name ? "is-invalid" : ""
                  }`}
                {...register("name", { required: true })}
                name="name"
                value={name}
                onChange={onChange}
              />
              {errors.name && (
                <div className="invalid-feedback">Name is required</div>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="email_field">Email</label>
              <input
                type="email"
                id="email_field"
                className={`form-control ${errors.email ? "is-invalid" : ""
                  }`}
                {...register("email", { required: true })}
                name="email"
                value={email}
                onChange={onChange}
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
                name="password"
                value={password}
                onChange={onChange}
              />
              {errors.password && (
                <div className="invalid-feedback">Password is required</div>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="avatar_upload">Avatar</label>
              <div className="d-flex align-items-center">
                <div>
                  <figure className="avatar mr-3 item-rtl">
                    <img
                      src={avatarPreview}
                      className="rounded-circle"
                      alt="Avatar Preview"
                    />
                  </figure>
                </div>
                <div className="custom-file">
                  <input
                    type="file"
                    name="avatar"
                    className={`form-control ${errors.avatar ? "is-invalid" : ""
                      }`}
                    {...register("avatar", { required: true })}
                    id="customFile"
                    accept="images/*"
                    onChange={onChange}
                  />
                  {errors.avatar && (
                    <div className="invalid-feedback">Image is required</div>
                  )}
                  <label className="custom-file-label" htmlFor="customFile">
                    Choose Avatar
                  </label>
                </div>
              </div>
            </div>

            <button
              id="register_button"
              type="submit"
              className="btn btn-block py-3"
              disabled={loading ? true : false}
            >
              Signup
            </button>
              <br/>
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
            <center><button id="login_button" type="submit" className="btn btn-block py-3" onClick={loginGoogle}>
              <FaGooglePlusG size={"2em"} className="google-icon" /> <span className="google-text">Signup with google</span>
            </button>
            </center>
          </form>
        </div>
      </div>
    </Fragment>
  );
};

export default Register;
