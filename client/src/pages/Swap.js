const Swap = () => {
    return(
        <div className = "swap-page">
            <div className = "dex-wrapper">
                <div className = "from-section">
                    <button className = "from-token-button">ETH</button>
                    <input type = "number" className = "from-amount"/>
                </div>
                <div className = "exchange-arrow-container">
                    {/* the arrow icon */}
                </div>
                <div className = "to-section">
                    <button className = "to-token-button">ETH</button>
                    <input type = "number" className = "to-amount"/>
                </div>
            </div>
        </div>
    );
}

export default Swap;