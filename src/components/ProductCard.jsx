import React from "react";

function ProductCard(props) {
  return (
    <div className="product-card rounded-md relative mb-10 w-64 bg-brand-pink">
      <div>
        <img
          src={props.image}
          alt="product-1"
          className="w-full h-80 rounded-md"
        />
      </div>
      <div className="text-[#613D2B] py-3 pl-4">
        <h5 className="font-bold py-1">{props.name}</h5>
        <h5 className="font-bold text-sm py-1">stock : {props.stock}</h5>
        <span className="py-1">Rp {props.price}</span>
      </div>
    </div>
  );
}

export default ProductCard;
