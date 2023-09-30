import React, { Fragment, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import MetaData from "../layout/MetaData";
import Sidebar from "./Sidebar";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useDispatch, useSelector } from "react-redux";
import { newProduct, clearErrors } from "../../actions/productActions";
import { NEW_PRODUCT_RESET } from "../../constants/productConstants";
import { useForm } from "react-hook-form";

const NewProduct = () => {
  const [images, setImages] = useState([]);
  const [imagesPreview, setImagesPreview] = useState([]);
  const categories = [
    "Nike",
    "Adidas",
    "Converse",
    "Vans",
    "Reebok",
    "Puma",
    "Jordan",
  ];
  const dispatch = useDispatch();
  let navigate = useNavigate();
  const { loading, error, success } = useSelector((state) => state.newProduct);

  const message = (message = "") =>
    toast.success(message, {
      position: toast.POSITION.BOTTOM_CENTER,
    });

  useEffect(() => {
    if (error) {
      dispatch(clearErrors());
    }

    if (success) {
      navigate("/admin/products");
      message("Product created successfully");
      dispatch({ type: NEW_PRODUCT_RESET });
    }
  }, [dispatch, error, success, navigate]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const onSubmit = (data) => {
    const formData = new FormData();
    formData.set("name", data.name);
    formData.set("price", data.price);
    formData.set("description", data.description);
    formData.set("category", data.category);
    formData.set("stock", data.stock);
    images.forEach((image) => {
      formData.append("images", image);
    });
    dispatch(newProduct(formData));
  };

  const onChange = (e) => {
    const files = Array.from(e.target.files);
    setImagesPreview([]);
    setImages([]);
    files.forEach((file) => {
      const reader = new FileReader();
      reader.onload = () => {
        if (reader.readyState === 2) {
          setImagesPreview((oldArray) => [...oldArray, reader.result]);
          setImages((oldArray) => [...oldArray, reader.result]);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  return (
    <Fragment>
      <MetaData title={"New Product"} />
      <div className="row">
        <div className="col-12 col-md-2">
          <Sidebar />
        </div>
        <div className="col-12 col-md-10">
          <Fragment>
            <div className="container container-fluid">
              <div className="row wrapper">
                <div className="col-10 col-lg-5">
                  <form
                    className="shadow-lg"
                    onSubmit={handleSubmit(onSubmit)}
                    encType="multipart/form-data"
                  >
                    <h1 className="mb-4">New Product</h1>
                    <div className="form-group">
                      <label htmlFor="name_field">Name</label>
                      <input
                        type="text"
                        id="name_field"
                        className={`form-control ${
                          errors.name ? "is-invalid" : ""
                        }`}
                        {...register("name", { required: true })}
                      />
                      {errors.name && (
                        <div className="invalid-feedback">Name is required</div>
                      )}
                    </div>
                    <div className="form-group">
                      <label htmlFor="price_field">Price</label>
                      <input
                        type="number"
                        id="price_field"
                        className={`form-control ${
                          errors.price ? "is-invalid" : ""
                        }`}
                        {...register("price", { required: true, min: 1 })}
                      />
                      {errors.price && (
                        <div className="invalid-feedback">
                          Price is required and should be greater than 0
                        </div>
                      )}
                    </div>
                    <div className="form-group">
                      <label htmlFor="description_field">Description</label>
                      <textarea
                        className={`form-control ${
                          errors.description ? "is-invalid" : ""
                        }`}
                        id="description_field"
                        rows="8"
                        {...register("description", { required: true })}
                      ></textarea>
                      {errors.description && (
                        <div className="invalid-feedback">
                          Description is required
                        </div>
                      )}
                    </div>
                    <div className="form-group">
                      <label htmlFor="category_field">Category</label>
                      <select
                        className={`form-control ${
                          errors.category ? "is-invalid" : ""
                        }`}
                        id="category_field"
                        {...register("category", { required: true })}
                      >
                        <option value="">Choose category</option>
                        {categories.map((category) => (
                          <option key={category} value={category}>
                            {category}
                          </option>
                        ))}
                      </select>
                      {errors.category && (
                        <div className="invalid-feedback">
                          Category is required
                        </div>
                      )}
                    </div>
                    <div className="form-group">
                      <label htmlFor="stock_field">Stock</label>
                      <input
                        type="number"
                        id="stock_field"
                        className={`form-control ${
                          errors.stock ? "is-invalid" : ""
                        }`}
                        {...register("stock", { required: true, min: 0 })}
                      />
                      {errors.stock && (
                        <div className="invalid-feedback">
                          Stock is required and should not be less than 0
                        </div>
                      )}
                    </div>
                    <div className="form-group">
                      <label>Images</label>
                      <div className="custom-file">
                        <input
                          type="file"
                          name="images"
                          className={`custom-file-input ${
                            errors.images ? "is-invalid" : ""
                          }`}
                          id="customFile"
                          onChange={onChange}
                          multiple
                        />
                        <label
                          className="custom-file-label"
                          htmlFor="customFile"
                        >
                          Choose Images
                        </label>
                        {errors.images && (
                          <div className="invalid-feedback">
                            Images are required
                          </div>
                        )}
                      </div>
                      {imagesPreview.map((image) => (
                        <img
                          src={image}
                          key={image}
                          alt="Images Preview"
                          className="mt-3 mr-2"
                          width="55"
                          height="52"
                        />
                      ))}
                    </div>
                    <button
                      id="login_button"
                      type="submit"
                      className="btn btn-block py-3"
                      disabled={loading ? true : false}
                    >
                      CREATE
                    </button>
                  </form>
                </div>
              </div>
            </div>
          </Fragment>
        </div>
      </div>
    </Fragment>
  );
};
export default NewProduct;
