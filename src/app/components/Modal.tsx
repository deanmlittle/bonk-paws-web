import { Organization } from "@/types";
import React, { useEffect, useState } from "react";
import axios from "axios";

interface ModalProps {
  organization?: Organization;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

const Modal: React.FC<ModalProps> = ({ organization, isOpen, setIsOpen }) => {
  const [quoteLoading, setQuoteloading] = React.useState(false);
  const [quoteAmount, setQuoteAmount] = React.useState("0");
  const [fromAmount, setFromAmount] = useState<number>(0);
  
  const getSwapQuote = async (amount: number) => {
    if(!quoteLoading) {
      setQuoteloading(true);
      try {
        const { data: quote } = await axios.get(`https://quote-api.jup.ag/v6/quote?inputMint=DezXAZ8z7PnrnRJjz3wXBoRgixCa6xjnB7YaB1pPB263&outputMint=So11111111111111111111111111111111111111112&amount=${amount}&slippageBps=50`);
        setQuoteAmount((quote.outAmount*1e-9).toFixed(9));
        setQuoteloading(false);
      } catch(e) {
        console.error(e);
        setQuoteAmount("0");
        setQuoteloading(false);
      }
    }
  }

  const updateFromAmount = async(amount: number) => {
    setFromAmount(amount);
    await getSwapQuote(amount*2*1e5);
  }

  return (
    <>
      {organization && isOpen ? (
        <>
          <div
            className="justify-center text-black items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none"
          >
            <div className="relative w-auto my-6 mx-auto max-w-3xl">
              <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
                <div className="flex p-5 border-b border-solid border-blueGray-200 rounded-t relative">
                  <h3 className="text-xl text-center mx-auto font-semibold">
                    {organization.name}
                  </h3>
                  <button className="absolute right-4 top-4 text-xl" onClick={() => setIsOpen(false)}>&times;</button>
                </div>
                {/*body*/}
                <div className="relative p-6 flex-auto">
                  <div className="flex">
                    <img className="h-20" src="money.png" alt="Donation" />
                  </div>
                  <p className="my-4 text-slate-500 text-md leading-relaxed">
                    Donating to <span className="font-bold text-slate-900">{organization.name}</span>
                  </p>
                  <div className="flex border border-slate-200 py-2 rounded-xl">
                    <input name = "fromForm" type="numeric" className="bg-transparent ml-3 font-raleway text-slate-900 font-regular !outline-none" value={fromAmount} onChange={(e) => updateFromAmount(parseFloat(e.target.value) || 0)} placeholder="Amount" style={{ flex: 1 }} />
                    <img className="w-8 h-8 mr-2" src="logo.png" />
                  </div>

                  <div className="flex border border-slate-200 py-2 rounded-xl">
                    <p className="bg-transparent ml-3 font-raleway text-slate-900 font-regular !outline-none" style={{ flex: 1 }}>
                      Match: {fromAmount}
                      </p>
                    <img className="w-8 h-8 mr-2" src="logo.png" />
                  </div>

                  <div className="flex border border-slate-200 py-2 rounded-xl">
                    <p className="bg-transparent ml-3 font-raleway text-slate-900 font-regular !outline-none" style={{ flex: 1 }}>
                      Burn: {fromAmount*0.01}
                      </p>
                    <img className="w-8 h-8 mr-2" src="logo.png" />
                  </div>

                  <div className="flex border border-slate-200 py-2 rounded-xl">
                    <p className="bg-transparent ml-3 font-raleway text-slate-900 font-regular !outline-none" style={{ flex: 1 }}>
                      Charity receives: {quoteAmount}
                      </p>
                    <img className="w-8 h-8 mr-2" src="sol.png" />
                  </div>
                  {/* <div className="bg-white rounded px-8 pt-6 pb-8 mb-4">
                    <input
                      className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                      id="amount"
                      type="number"
                      placeholder="Enter Amount"
                    />
                    </div> */}
                        {/* <span className="absolute inset-y-0 right-0 flex items-center pr-3">
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
                  </form> */}
                </div>
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