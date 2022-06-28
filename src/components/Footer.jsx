import React from "react";
import { LogoBlack } from "../exports/exportImages";

export default function Footer() {
  return (
    <div className="w-full flex flex-col items-center py-5">
      <img src={LogoBlack} alt="" />
      <p>Copyright {new Date().getFullYear()}.</p>
      <p>All right reserved.</p>
    </div>
  );
}
