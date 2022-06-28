import React, { useContext, useEffect } from "react";
import { globalTitle } from "./App";

import { AlertContext } from "../contexts/AuthContext";

import { JumbotronBg } from "../exports/exportImages";
import { Transition } from "@headlessui/react";

function Jumbotron() {
  const [alert, setAlert] = useContext(AlertContext);
  useEffect(() => {
    document.title = globalTitle + "Home";
  }, []);

  return (
    <>
      <div className={(alert ? "flex" : "hidden") + " justify-center relative"}>
        <div className="absolute w-64 bg-red-500 rounded-md text-white text-center py-4 -top-14">
          Please Login!
        </div>
      </div>
      <Transition
        show={true}
        enter="transition ease duration-1000"
        enterFrom="transform -translate-x-20 opacity-0"
        enterTo="transform translate-x-0 opacity-100"
      >
        <div className="mx-4 lg:mx-60 my-2 lg:mt-10 lg:mb-20 relative h-80 lg:h-full">
          <img
            src={JumbotronBg}
            alt="jumbotron"
            className="opacity-0 lg:opacity-100"
          />
        </div>
      </Transition>
    </>
  );
}

export default Jumbotron;
