import React, { Fragment, useEffect, useRef } from "react";
import { Link, useParams } from "react-router-dom";
import MetaData from "../layout/MetaData";
import Loader from "../layout/Loader";
// import { PDFExport, savePDF,} from "@progress/kendo-react-pdf";

// import { useAlert } from "react-alert";

import { useDispatch, useSelector } from "react-redux";

import { getOrderDetails, clearErrors } from "../../actions/orderActions";

import {PDFDownloadLink} from "@react-pdf/renderer";
import Receipt from "./ReceiptPdf";

const OrderDetails = () => {
//   const alert = useAlert();

  const dispatch = useDispatch();

  const { loading, error, order = {} } = useSelector(
    (state) => state.orderDetails
  );

  const {
    shippingInfo,
    orderItems,
    paymentInfo,
    user,
    totalPrice,
    orderStatus,
  } = order;

  // const pdfExportComponent = useRef(null);
  // const contentArea = useRef(null);

  // const handleExportWithMethod = (event) => {
  //   savePDF(contentArea.current, { paperSize: "A4" });
  // };

  let { id } = useParams();

  useEffect(() => {
    dispatch(getOrderDetails(id));

    if (error) {
    //   alert.error(error);

      dispatch(clearErrors());
    }
  }, [dispatch, error, id]);

  const shippingDetails =
    shippingInfo &&
    `${shippingInfo.address}, ${shippingInfo.city}, ${shippingInfo.postalCode}, ${shippingInfo.country}`;

  const isPaid =
    paymentInfo && paymentInfo.status === "succeeded" ? true : false;

  return (
    <Fragment>
      <div className='app-content'>
        {/* <PDFExport ref={pdfExportComponent} paperSize="A4">
          <div ref={contentArea}>
            <h1>Receipt for Order #{order._id}</h1>
            <h2>Customer Contact #{shippingInfo && shippingInfo.phoneNo}</h2>
            <h3>{shippingDetails}</h3>
            <table>
              <thead>
                <tr>
                  <th>Customer name</th>
                  <th>Image</th>
                  <th>Item name</th>
                  <th>Price</th>
                  <th>Quantity</th>
                  <th>Total</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>{user && user.name}</td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                </tr>
                {orderItems &&
                  orderItems.map((item) => (
                    <tr key={item.product}>
                      <td></td>
                      <td>
                        <img src={item.image} height="45" width="65" />
                      </td>
                      <td>{item.name}</td>
                      <td>${item.price}</td>
                      <td>{item.quantity} Piece(s)</td>
                      <td>{totalPrice}</td>
                    </tr>
                  ))}
                
              </tbody>
            </table>
            <div className="button-area"></div>
          </div>
        </PDFExport> */}
        {/* <PDFExport ref={pdfExportComponent} paperSize="A4">
          <div ref={contentArea}>
            <h1>Receipt for Order #{order._id}</h1>
            <h2>Customer Contact #{shippingInfo && shippingInfo.phoneNo}</h2>
            <h3>{shippingDetails}</h3>
            <table style={{ border: "1px solid black", borderCollapse: "collapse" }}>
              <thead>
                <tr>
                  <th style={{ border: "1px solid black", padding: "5px" }}>Customer name</th>
                  <th style={{ border: "1px solid black", padding: "5px" }}>Image</th>
                  <th style={{ border: "1px solid black", padding: "5px" }}>Item name</th>
                  <th style={{ border: "1px solid black", padding: "5px" }}>Price</th>
                  <th style={{ border: "1px solid black", padding: "5px" }}>Quantity</th>
                  <th style={{ border: "1px solid black", padding: "5px" }}>Total</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td style={{ border: "1px solid black", padding: "5px" }}>{user && user.name}</td>
                  <td style={{ border: "1px solid black", padding: "5px" }}></td>
                  <td style={{ border: "1px solid black", padding: "5px" }}></td>
                  <td style={{ border: "1px solid black", padding: "5px" }}></td>
                  <td style={{ border: "1px solid black", padding: "5px" }}></td>
                  <td style={{ border: "1px solid black", padding: "5px" }}></td>
                </tr>
                {orderItems &&
                  orderItems.map((item) => (
                    <tr key={item.product}>
                      <td style={{ border: "1px solid black", padding: "5px" }}></td>
                      <td style={{ border: "1px solid black", padding: "5px" }}>
                        <img src={item.image} height="45" width="65" />
                      </td>
                      <td style={{ border: "1px solid black", padding: "5px" }}>{item.name}</td>
                      <td style={{ border: "1px solid black", padding: "5px" }}>${item.price}</td>
                      <td style={{ border: "1px solid black", padding: "5px" }}>{item.quantity} Piece(s)</td>
                      <td style={{ border: "1px solid black", padding: "5px" }}>{totalPrice}</td>
                    </tr>
                  ))}
              </tbody>
            </table>
            <div className="button-area"></div>
          </div>
        </PDFExport> */}
        {/* <PDFExport ref={pdfExportComponent} paperSize="A4">
          <div ref={contentArea}>
            <h1 style={{ textAlign: "center", marginBottom: "20px" }}>
              Receipt for Order #{order._id}
            </h1>
            <h2 style={{ marginBottom: "10px" }}>
              Customer Contact #{shippingInfo && shippingInfo.phoneNo}
            </h2>
            <h3 style={{ marginBottom: "20px" }}>{shippingDetails}</h3>
            <table style={{ borderCollapse: "collapse", width: "100%" }}>
              <thead>
                <tr style={{ borderBottom: "2px solid #333", paddingBottom: "5px" }}>
                  <th style={{ textAlign: "left" }}>Customer name</th>
                  <th style={{ textAlign: "left" }}>Image</th>
                  <th style={{ textAlign: "left" }}>Item name</th>
                  <th style={{ textAlign: "left" }}>Price</th>
                  <th style={{ textAlign: "left" }}>Quantity</th>
                  <th style={{ textAlign: "left" }}>Total</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td style={{ paddingTop: "10px" }}>{user && user.name}</td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                </tr>
                {orderItems &&
                  orderItems.map((item) => (
                    <tr key={item.product}>
                      <td></td>
                      <td>
                        <img src={item.image} height="45" width="65" />
                      </td>
                      <td style={{ paddingTop: "10px" }}>{item.name}</td>
                      <td style={{ paddingTop: "10px" }}>${item.price}</td>
                      <td style={{ paddingTop: "10px" }}>
                        {item.quantity} Piece(s)
                      </td>
                      <td style={{ paddingTop: "10px" }}>{totalPrice}</td>
                    </tr>
                  ))}
              </tbody>
            </table>
            <div className="button-area"></div>
          </div>
        </PDFExport> */}
  
        {/* <PDFExport ref={pdfExportComponent} paperSize="A4">
          <div ref={contentArea}>
            <h1 style={{ fontSize: "24px", fontWeight: "bold", marginBottom: "20px" }}>Receipt for Order # <b>{order._id}</b></h1>
            <h2 style={{ fontSize: "18px", marginBottom: "10px" }}>Customer Name : <b>{user && user.name}</b></h2>
            <h2 style={{ fontSize: "18px", marginBottom: "10px" }}>Customer Contact #: <b>{shippingInfo && shippingInfo.phoneNo}</b></h2>
            <h3 style={{ fontSize: "16px", marginBottom: "10px" }}>Shipping Address: <b>{shippingDetails}</b></h3>
            <table style={{ border: "1px solid black", borderCollapse: "collapse", width: "100%" }}>
              <thead>
                <tr>
                  <th style={{ border: "1px solid black", padding: "5px", fontWeight: "bold" }}>Image</th>
                  <th style={{ border: "1px solid black", padding: "5px", fontWeight: "bold" }}>Item name</th>
                  <th style={{ border: "1px solid black", padding: "5px", fontWeight: "bold" }}>Price</th>
                  <th style={{ border: "1px solid black", padding: "5px", fontWeight: "bold" }}>Quantity</th>
                  <th style={{ border: "1px solid black", padding: "5px", fontWeight: "bold" }}>Total</th>
                </tr>
              </thead>
              <tbody>
                {orderItems &&
                  orderItems.map((item) => (
                    <tr key={item.product}>
                      <td style={{ border: "1px solid black", padding: "5px" }}>
                        <img src={item.image} height="45" width="65" />
                      </td>
                      <td style={{ border: "1px solid black", padding: "5px" }}>{item.name}</td>
                      <td style={{ border: "1px solid black", padding: "5px" }}>${item.price}</td>
                      <td style={{ border: "1px solid black", padding: "5px" }}>{item.quantity} Piece(s)</td>
                      <td style={{ border: "1px solid black", padding: "5px" }}>{totalPrice}</td>
                    </tr>
                  ))}
              </tbody>
            </table>
            <div className="button-area"></div>
          </div>
        </PDFExport> */}
      </div>
      <MetaData title={"Order Details"} />

      {loading ? (
        <Loader />
      ) : (
        <Fragment>

            
          <div className="row d-flex justify-content-between">
            <div className="col-12 col-lg-8 mt-5 order-details">
              <h1 className="my-5">Order # {order._id}</h1>

              <h4 className="mb-4">Shipping Info</h4>

              <p>
                <b>Name:</b> {user && user.name}
              </p>
              <p>
                <b>Phone:</b> {shippingInfo && shippingInfo.phoneNo}
              </p>

              <p className="mb-4">
                <b>Address:</b>
                {shippingDetails}
              </p>

              <p>
                <b>Amount:</b> ${totalPrice}
              </p>

              <hr />

              <h4 className="my-4">Payment</h4>

              <p className={isPaid ? "greenColor" : "redColor"}>
                <b>{isPaid ? "PAID" : "NOT PAID"}</b>
              </p>

              <h4 className="my-4">Order Status:</h4>

              <p
                className={
                  order.orderStatus &&
                  String(order.orderStatus).includes("Delivered")
                    ? "greenColor"
                    : "redColor"
                }
              >
                <b>{orderStatus}</b>
              </p>

              <h4 className="my-4">Order Items:</h4>

              <hr />

              <div className="cart-item my-1">
                {orderItems &&
                  orderItems.map((item) => (
                    <div key={item.product} className="row my-5">
                      <div className="col-4 col-lg-2">
                        <img
                          src={item.image}
                          alt={item.name}
                          height="45"
                          width="65"
                        />
                      </div>

                      <div className="col-5 col-lg-5">
                        <Link to={`/products/${item.product}`}>
                          {item.name}
                        </Link>
                      </div>

                      <div className="col-4 col-lg-2 mt-4 mt-lg-0">
                        <p>${item.price}</p>
                      </div>

                      <div className="col-4 col-lg-3 mt-4 mt-lg-0">
                        <p>{item.quantity} Piece(s)</p>
                      </div>
                    </div>
                  ))}
              </div>

              <hr />
            </div>
          </div>
        </Fragment>
      )}
      {/* <button className="btn btn-primary btn-block" onClick={handleExportWithMethod} disabled={order.status === 'Processing'}>Print Receipt</button>
      <button className="btn btn-primary btn-block" onClick={handleExportWithMethod} enabled={order.status === 'Delivered'} >Print Receipt</button> */}

      {/* {if (order.status === 'Processing') {
        <button className="btn btn-primary btn-block" onClick={handleExportWithMethod} disabled>Print Receipt</button>
      } 
      else if (order.status === 'Delivered') {
        <button className="btn btn-primary btn-block" onClick={handleExportWithMethod}>Print Receipt</button>
      }} */}

      {/* {order.orderStatus === 'Processing' ? (
        <button className="btn btn-primary btn-block" onClick={handleExportWithMethod} disabled>Print Receipt</button>
      ) : order.orderStatus === 'Delivered' ? (
          <button className="btn btn-primary btn-block" onClick={handleExportWithMethod}>Print Receipt</button>
      ) : null} */}

      {order.orderStatus === 'Processing' ? (
        <button className="btn btn-primary btn-block" hidden>
          <i className="fa fa-print" /> Print Receipt
        </button>
      ) : order.orderStatus === 'Delivered' ? (
        <PDFDownloadLink
          document={<Receipt order={order} />}
          fileName={`receipt-${order._id}.pdf`}
          className="btn btn-primary btn-block"
        >
        <i className="fa fa-print" />Print Receipt
        </PDFDownloadLink>
      ) : null}
    </Fragment>
  );
};

export default OrderDetails;
