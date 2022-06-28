import { useState, useEffect, useContext } from "react";
import formatThousands from "format-thousands";
import { useNavigate, useParams } from "react-router-dom";
import { API } from "../config/api";
import { globalTitle } from "../components/App";
import rupiahFormat from "rupiah-format";

import { OrderContext } from "../contexts/OrderContext";
import { UserContext } from "../contexts/UserContext";

export default function ProductDesc({ item }) {
  let { id } = useParams();

  let navigate = useNavigate();

  const [product, setProduct] = useState({});
  const [toppings, setToppings] = useState([]);
  const [quantity, setQuantity] = useState(1);
  const [topping, setTopping] = useState({});
  const [checked, setChecked] = useState(false);
  const [value, setValue] = useState(1);

  const handleChange = (event) => {
    setValue(event.target.value);
  };

  const [order, setOrder] = useContext(OrderContext);
  const [state, dispatch] = useContext(UserContext);

  const decrement = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  const increment = () => {
    setQuantity(quantity + 1);
  };

  const getOrders = async () => {
    try {
      const response = await API.get(`/orders/${state.user.id}`);
      setOrder(response.data.orders);
    } catch (error) {
      console.log(error);
    }
  };

  const getProduct = async (id) => {
    try {
      const response = await API.get("/product/" + id);
      setProduct(response.data.data.product);
    } catch (error) {
      console.log(error);
    }
  };

  const getTopping = async () => {
    try {
      const response = await API.get("/topping/" + value);
      setTopping(response.data.data.topping);
      console.log(response);
    } catch (error) {
      console.log(error);
    }
  };

  const getToppings = async () => {
    try {
      const response = await API.get("/toppings");
      let responseToppings = response.data.data.toppings;
      const filteredToppings = responseToppings.filter(
        (topping) => topping.id !== 1
      );
      setToppings(responseToppings);
    } catch (error) {
      console.log(error);
    }
  };

  const handleSubmit = async (e) => {
    try {
      e.preventDefault();

      if (state.isLogin === false) {
        navigate("/");
        return;
      }

      const config = {
        headers: {
          "Content-type": "application/json",
        },
      };

      const body = {
        idProduct: id,
        idTopping: value,
        qty: quantity,
      };

      const response = await API.post("/order", body, config);
      getOrders();
      navigate("/my-cart");
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getTopping();
  }, [value]);

  useEffect(() => {
    document.title = globalTitle + "Product";
    getToppings();
    getProduct(id);
    console.log(product);
    return () => {
      setToppings([]);
      setProduct({});
    };
  }, []);

  return (
    <>
      <div className="mx-8 lg:pt-10 pb-20 lg:mx-32 lg:flex">
        <div className="img my-8 lg:my-0 w-full lg:w-5/12">
          <img
            src={"http://localhost:5000/uploads/" + product.image}
            alt="product"
            className="w-full lg:w-96 rounded-2xl"
          />
        </div>
        <div className="text w-full lg:w-7/12">
          <div className="mb-10">
            <h1 className="text-[#613D2B] text-2xl lg:text-4xl font-extrabold font-['Avenir-Black'] mb-4">
              {product?.title}
            </h1>
            <h1 className="text-[#613D2B] text-sm lg:text-xl font-extrabold font-['Avenir-Black'] mb-4">
              Stock : {product?.stock}
            </h1>
            <h1 className="text-black text-sm lg:text-md font-light mb-4">
              {product?.desc}
            </h1>
            <p className="text-[#613D2B] text-xl">
              {rupiahFormat.convert(product?.price)}
            </p>
          </div>

          <div className="text-center mb-4">
            <button
              type="button"
              onClick={decrement}
              className="bg-brand-pink px-4 py-2 text-[#613D2B] rounded-md active:bg-[#613D2B] active:text-[#b18671]"
            >
              -
            </button>
            <span className="px-6 py-2 text-[#613D2B] font-bold">
              {quantity}
            </span>
            <button
              type="button"
              onClick={increment}
              className="bg-brand-pink px-4 py-2 text-[#613D2B] rounded-md active:bg-[#613D2B] active:text-brand-pink"
            >
              +
            </button>
          </div>

          <button
            onClick={handleSubmit}
            className="w-full bg-[#613D2B] text-white py-2 rounded-md hover:bg-[#613D2B]"
          >
            Add To Cart
          </button>
        </div>
      </div>
    </>
  );
}
