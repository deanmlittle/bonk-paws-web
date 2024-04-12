import React from "react";

const WalletButton: React.FC<{ onClick: () => void }> = ({ onClick }) => {
  return (
    <button
      className="bg-bonk-orange hover:opacity-50 text-white font-semibold py-3 px-5 border shadow-md duration-300 transition-all cursor-pointer rounded-lg"
      onClick={onClick}
    >
      Connect Wallet
    </button>
  );
};

export default WalletButton;
