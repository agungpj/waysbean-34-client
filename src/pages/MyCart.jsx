import { useContext, useEffect, useState } from "react";
import formatThousands from "format-thousands";
import { Link, useNavigate } from "react-router-dom";
import { globalTitle } from "../components/App";
import { API } from "../config/api";

import { UserContext } from "../contexts/UserContext";
import { CartModalContext } from "../contexts/ModalContext";
import { OrderContext } from "../contexts/OrderContext";

import { uploads } from "../exports";
import { CartModal } from "../exports";
import { InvoiceIcon } from "../exports/exportImages";

function MyCart() {
  const [order, setOrder] = useContext(OrderContext);
  const [open, setOpen] = useContext(CartModalContext);
  const [state, dispatch] = useContext(UserContext);

  const [preview, setPreview] = useState(null);
  const [total, setTotal] = useState(0);
  const [form, setForm] = useState({
    fullname: state.user.fullname,
    email: state.user.email,
    phone: state.user.profile.phone ? state.user.profile.phone : "",
    address: state.user.profile.address ? state.user.profile.address : "",
    totalPrice: total,
    // attachment: "",
  });

  let navigate = useNavigate();

  const { fullname, email, phone, address, totalPrice } = form;

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });

    // Create image url for preview
    // if (e.target.type === "file") {
    //   let url = URL.createObjectURL(e.target.files[0]);
    //   setPreview(url);
    // }
  };

  const handleSubmit = async (e) => {
    try {
      e.preventDefault();

      // Configuration
      const config = {
        headers: {
          "Content-type": "application/json",
        },
      };

      form.totalPrice = order
        .map((item) => item.price)
        .reduce((prev, next) => prev + next);

      // const formData = new FormData();
      // formData.set("fullname", form.fullname);
      // formData.set("email", form.email);
      // formData.set("phone", form.phone);
      // formData.set("address", form.address);
      // formData.set("totalPrice", form.totalPrice);
      // formData.set("attachment", form.attachment[0], form.attachment[0].name);

      const body = JSON.stringify(form);

      const response = await API.post("/transaction", body, config);
      console.log(response);

      setOpen(!open);
      setTimeout(() => {
        setOpen(false);
        navigate(`/`);
        checkUser();
      }, 5000);
    } catch (error) {
      console.log(error);
    }
  };

  const getOrders = async () => {
    try {
      const response = await API.get(`/orders/${state.user.id}`);
      // Store order data to useState variabel
      setOrder(response.data.orders);
    } catch (error) {
      console.log(error);
    }
  };

  const deleteOrder = async (id) => {
    try {
      const response = await API.delete("/order/" + id);
      getOrders();
    } catch (error) {
      console.log(error);
    }
  };

  const checkUser = async () => {
    try {
      const response = await API.get("/check-auth");

      // If the token incorrect
      if (response.status === 404) {
        return dispatch({
          type: "AUTH_ERROR",
        });
      }

      // Get user data
      let payload = response.data.data.user;
      // Get token from local storage
      payload.token = localStorage.token;

      // Send data to useContext
      dispatch({
        type: "USER_SUCCESS",
        payload,
      });
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    document.title = globalTitle + "My Cart";
    console.log(order);
  }, []);

  return (
    <div className="text-brand-[#613D2B] font-['Avenir-Book'] mx-4 lg:mx-28 mt-8 mb-20">
      <h4 className="font-['Avenir-Black'] font-bold text-3xl mb-8">My Cart</h4>
      {order.length > 0 ? (
        <>
          <div className="lg:flex justify-between">
            <div className="w-full lg:w-7/12 mb-20 lg:mb-0">
              <div className="mb-4 flex justify-between">
                <p>Review Your Order</p>
                <Link to="/" className="hover:underline mb-3">
                  Continue Shopping
                </Link>
              </div>
              <hr className="border-1 border-brand-[#613D2B]" />
              {order.map((item) => (
                <div key={item.id} className="flex justify-between">
                  <div className="flex my-4 gap-x-4">
                    <img
                      src={
                        "http://localhost:5000/uploads/" + item?.product.image
                      }
                      className="h-20 w-20 object-cover rounded-lg"
                      alt="product"
                    />
                    <div className="flex flex-col justify-center gap-y-2">
                      <h4>
                        <span className="font-bold">{item.product.title}</span>{" "}
                        X {item.qty}
                      </h4>
                    </div>
                  </div>
                  <div className="flex flex-col justify-center items-end gap-y-2">
                    <h4>Rp {formatThousands(item.price, ".")},-</h4>
                    <button type="button" onClick={() => deleteOrder(item.id)}>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-6 w-6"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                        />
                      </svg>
                    </button>
                  </div>
                </div>
              ))}
              <hr className="border-1 border-brand-[#613D2B] mb-12" />
              <div className="flex justify-between space-x-4 lg:space-x-0">
                <div className="w-7/12 lg:w-1/2">
                  <hr className="border-1 border-brand-[#613D2B] mb-5" />
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span>Subtotal</span>
                      <span>
                        Rp{" "}
                        {order.length > 0
                          ? formatThousands(
                              order
                                .map((item) => item.price)
                                .reduce((prev, next) => prev + next),
                              "."
                            )
                          : 0}
                        ,-
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Qty</span>
                      <span>{order.length > 0 ? order.length : 0}</span>
                    </div>
                  </div>
                  <hr className="border-brand-[#613D2B] my-5" />
                  <div className="flex justify-between font-bold">
                    <span>Total</span>
                    <span>
                      Rp{" "}
                      {order.length > 0
                        ? formatThousands(
                            order
                              .map((item) => item.price)
                              .reduce((prev, next) => prev + next),
                            "."
                          )
                        : 0}
                      ,-
                    </span>
                  </div>
                </div>
              </div>
            </div>
            <div className="w-full lg:w-4/12">
              <form id="paymentForm" onSubmit={handleSubmit}>
                <div className="space-y-6 mb-8">
                  <input
                    type="hidden"
                    name="totalPrice"
                    id="totalPrice"
                    onChange={handleChange}
                    value={totalPrice}
                  />
                  <input
                    type="text"
                    name="fullname"
                    placeholder="Name"
                    onChange={handleChange}
                    value={fullname}
                    required
                    className="w-full p-3 outline outline-2 outline-[#613D2B] focus:outline-[#613D2B] rounded-md bg-white"
                  />
                  <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    onChange={handleChange}
                    value={email}
                    required
                    className="w-full p-3 outline outline-2 outline-[#613D2B] focus:outline-[#613D2B] rounded-md bg-white"
                  />
                  <input
                    type="tel"
                    name="phone"
                    placeholder="Phone"
                    onChange={handleChange}
                    value={phone}
                    required
                    className="w-full p-3 outline outline-2 outline-[#613D2B] focus:outline-[#613D2B] rounded-md bg-white"
                  />
                  <textarea
                    name="address"
                    id="address"
                    className="w-full p-3 outline outline-2 outline-[#613D2B] focus:outline-[#613D2B] rounded-md bg-white"
                    rows={5}
                    placeholder="Address"
                    onChange={handleChange}
                    value={address}
                    required
                  ></textarea>
                </div>
                <button
                  type="submit"
                  className="w-full py-2 rounded-md text-white text-center bg-[#613D2B]"
                >
                  Pay
                </button>
              </form>
              <CartModal />
            </div>
          </div>
        </>
      ) : (
        <div className="text-center">
          <p className="text-2xl mb-4">Cart is Empty.</p>
          <Link to="/" className="hover:underline">
            Continue shopping.
          </Link>
        </div>
      )}
    </div>
  );
}

export default MyCart;
