'use client';

import { Organization } from "@/types";
import React from "react";

const Modal:React.FC<{organization?: Organization}> = ({ organization }) => {
  const [showModal, setShowModal] = React.useState(false);
  return (
    <>
      {organization ? (
        <>
          <div
            className="justify-center text-black items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none"
          >
            <div className="relative w-auto my-6 mx-auto max-w-3xl">
              <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
                {/*header*/}
                <div className="flex p-5 border-b border-solid border-blueGray-200 rounded-t">
                  <h3 className="text-xl text-center mx-auto font-semibold">
                    {organization.name}
                  </h3>
                </div>
                {/*body*/}
                <div className="relative p-6 flex-auto">
                  <p className="my-4 text-blueGray-500 text-lg leading-relaxed">
                    Donate to this great cause with BONK!
                  </p>
                  <form className="bg-white rounded px-8 pt-6 pb-8 mb-4">
                    <div className="mb-4">
                      <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="amount">
                        Amount
                      </label>
                      <div className="relative">
                        <input
                          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                          id="amount"
                          type="number"
                          placeholder="Enter Amount"
                        />
                        <span className="absolute inset-y-0 right-0 flex items-center pr-3">
                          <label className="text-gray-700">Max:</label>
                          <input
                            className="border-l-2 pl-2 ml-2 text-gray-700"
                            type="number"
                            placeholder="Max"
                          />
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <button
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                        type="button"
                      >
                        Submit
                      </button>
                    </div>
                  </form>

                  {/* <form> */}
                    {/* <input  */}
                  {/* // </form> */}
                </div>
                {/*footer*/}
                {/* <div className="flex items-center justify-end p-6 border-t border-solid border-blueGray-200 rounded-b">
                  <button
                    className="text-red-500 background-transparent font-bold uppercase px-6 py-2 text-sm outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                    type="button"
                    onClick={() => setShowModal(false)}
                  >
                    Close
                  </button>
                  <button
                    className="bg-orange-500 text-white active:bg-orange-600 font-bold text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                    type="button"
                    onClick={() => setShowModal(false)}
                  >
                    Save Changes
                  </button>
                </div> */}
              </div>
            </div>
          </div>
          <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
        </>
      ) : null}
    </>
  );
}

export default Modal;