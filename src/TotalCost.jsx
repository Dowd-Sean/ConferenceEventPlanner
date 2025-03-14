import React, { useState, useEffect } from 'react'; //Esure acces to React, useState, useEffect,
import "./TotalCost.css"; //ensure acces to stylesheet

const TotalCost = ({ totalCosts, ItemsDisplay }) => {
    //Gets total cost from ConferenceEvent.jsx
  const total_amount = totalCosts.venue + totalCosts.av + totalCosts.meals; 

  return (
    <div className="pricing-app">
      <div className="display_box">
        <div className="header">
          <p className="preheading"><h3>Total cost for the event</h3></p>
        </div>
        <div>
            <h2 id="pre_fee_cost_display" className="price"> 
                ${total_amount} {/* Displays Total Amount */}
            </h2>
            <div className="render_items">
                <ItemsDisplay /> {/* Renders the table created in the ItemsDisplay Function */}
            </div>
        </div>
      </div>
    </div>
  );
};

export default TotalCost;
