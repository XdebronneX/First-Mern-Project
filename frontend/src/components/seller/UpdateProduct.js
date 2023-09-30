import React, { Fragment, useState, useEffect } from "react";
import MetaData from "../layout/MetaData";
import Sidebar from "./Sidebar";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  updateProduct,
  getProductDetails,
  clearErrors,
} from "../../actions/productActions";
import { UPDATE_PRODUCT_RESET } from "../../constants/productConstants";
import { useForm } from "react-hook-form";

const UpdateProduct = () => {
  const [oldImages, setOldImages] = useState([]);
  const [imagesPreview, setImagesPreview] = useState([]);
  const [images, setImages] = useState([]);
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
  const { error, product } = useSelector((state) => state.productDetails);
  const { loading, error: updateError, isUpdated } = useSelector(
    (state) => state.product
  );
  let { id } = useParams();
  let navigate = useNavigate();
  const errMsg = (message = "") =>
    toast.error(message, {
      position: toast.POSITION.BOTTOM_CENTER,
    });
  const successMsg = (message = "") =>
    toast.success(message, {
      position: toast.POSITION.BOTTOM_CENTER,
    });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    if (product && product._id !== id) {
      dispatch(getProductDetails(id));
    } else {
      setOldImages(product.images);
      setImagesPreview(product.images);
      reset({
        name: product.name,
        price: product.price,
        description: product.description,
        category: product.category,
        stock: product.stock,
      });
    }
    if (error) {
      errMsg(error);
      dispatch(clearErrors());
    }

    if (updateError) {
      errMsg(updateError);
      dispatch(clearErrors());
    }

    if (isUpdated) {
      navigate("/seller/products");
      successMsg("Product updated successfully");
      dispatch({ type: UPDATE_PRODUCT_RESET });
    }
  }, [dispatch, error, isUpdated, navigate, updateError, product, id, reset]);

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
    dispatch(updateProduct(product._id, formData));
  };

  const onChange = (e) => {
    const files = Array.from(e.target.files);
    setImagesPreview([]);
    setImages([]);
    setOldImages([]);
    files.forEach((file) => {
      const reader = new FileReader();
      reader.onload = () => {
        if (reader.readyState === 2) {
          setImagesPreview((oldArray) => [...oldArray, reader.result]);
          setImages((oldArray) => [...oldArray,  reader.result]);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  return (
    <Fragment>
      <MetaData title="Update Product" />
      <div className="row">
        <div className="col-12 col-md-2">
          <Sidebar />
        </div>
        <div className="col-12 col-md-10">
        <Fragment>
          <div className="wrapper my-5">
              <form onSubmit={handleSubmit(onSubmit)}  className="shadow-lg" encType="multipart/form-data">
              <h1 className="mb-4">Update Product</h1>
                <div className="form-group">
                  <label htmlFor="name_field">Name</label>
                  <input
                    type="text"
                    id="name_field"
                    className="form-control"
                    placeholder="Product name"
                    name="name"
                    {...register("name", { required: true })}
                  />
                  {errors.name && (
                    <span className="text-danger">This field is required</span>
                  )}
                </div>
                <div className="form-group">
                  <label htmlFor="price_field">Price</label>
                  <input
                    type="number"
                    id="price_field"
                    className="form-control"
                    placeholder="Product price"
                    name="price"
                    {...register("price", { required: true })}
                  />
                  {errors.price && (
                    <span className="text-danger">This field is required</span>
                  )}
                </div>
                <div className="form-group">
                  <label htmlFor="description_field">Description</label>
                  <textarea
                    className="form-control"
                    id="description_field"
                    rows="8"
                    placeholder="Product description"
                    name="description"
                    {...register("description", { required: true })}
                  />
                  {errors.description && (
                    <span className="text-danger">This field is required</span>
                  )}
                </div>
                <div className="form-group">
                  <label htmlFor="category_field">Category</label>
                  <select
                    className="form-control"
                    id="category_field"
                    name="category"
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
                    <span className="text-danger">This field is required</span>
                  )}
                </div>
                <div className="form-group">
                  <label htmlFor="stock_field">Stock</label>
                  <input
                    type="number"
                    id="stock_field"
                    className="form-control"
                    placeholder="Product stock"
                    name="stock"
                    {...register("stock", { required: true })}
                  />
                  {errors.stock && (
                    <span className="text-danger">This field is required</span>
                  )}
                </div>
                <div className="form-group">
                <label>Images</label>
                  <div className="custom-file">
                    <input
                      type="file"
                      name="images"
                      className="custom-file-input"
                      id="customFile"
                      onChange={onChange}
                      multiple
                    />

                    <label className="custom-file-label" htmlFor="customFile">
                      Choose Images
                    </label>
                  </div>
                </div>
                {imagesPreview.map((image) => (
                  <div key={image} className="image-preview">
                    <img src={image} alt="Preview" width="55"
                          height="52"/>
                  </div>
                ))}
                <button
                  type="submit"
                  className="btn btn-update"
                  disabled={loading ? true : false}
                >
                  Update
                </button>
              </form>
            </div>
          </Fragment>
        </div>
      </div>
    </Fragment>
  );
};
export default UpdateProduct;
