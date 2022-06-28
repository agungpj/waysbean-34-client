import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import formatThousands from "format-thousands";
import { API } from "../config/api";

import { ProductCard } from "../exports";

function Menu() {
  const [products, setProducts] = useState([]);

  const getProducts = async () => {
    try {
      const response = await API.get("/products");
      // Store product data to useState variabel
      setProducts(response.data.data.products);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getProducts();
  }, []);

  return (
    <div className="mx-4 lg:mx-32 my-2 lg:my-10 relative">
      <div className="product-list flex flex-wrap justify-center lg:justify-start mb-20">
        {products.map((item, index) => (
          <Link to={`/product/${item.id}`} key={index} className="lg:mr-4">
            <ProductCard
              name={item.title}
              stock={item.stock}
              image={item.image}
              price={formatThousands(item.price, ".")}
              key={item.id}
            />
          </Link>
        ))}
      </div>
    </div>
  );
}

export default Menu;
