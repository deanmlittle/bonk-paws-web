import React from "react"

const WalletButton: React.FC<{ onClick: () => void }> = ({ onClick }) => {
    return (
        <button className="bg-red-500 hover:bg-red-400 text-white font-semibold py-3 px-5 border border-red-600 hover:border-red-600 rounded-lg" onClick={onClick}>
            Connect Wallet
        </button>
    )
}

export default WalletButton
