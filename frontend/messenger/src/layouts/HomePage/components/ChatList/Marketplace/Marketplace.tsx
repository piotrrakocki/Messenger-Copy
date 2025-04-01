import React from 'react';
import MarketPlaceCSS from "./Marketplace.module.css";

export const Marketplace = () => {
    return (
        <div className={MarketPlaceCSS.container}>
            <div className={MarketPlaceCSS.headerContainer}>
                <div className={MarketPlaceCSS.h1Container}>
                    <h1>Marketplace</h1>
                </div>
            </div>
            <div className={MarketPlaceCSS.chatListContainer}>
                <p>No message found.</p>
            </div>
        </div>
    )
}