import React from "react";

const DeliveryChargeCalculator = ({ zipCode }) => {
  // Delivery charges based on zip codes
  const deliveryCharges = {
    "07631": 5.00, // Englewood, NJ
    "07666": 8.00, // Englewood, NJ (shared with Teaneck)
    "07608": 8.00, // Teaneck, NJ
    "07621": 8.00, // Bergenfield, NJ
    "07670": 8.00, // Tenafly, NJ
    "07601": 6.00, // Hackensack, NJ
    "07632": 8.00, // Englewood Cliffs, NJ
    "07605": 12.00, // Leonia, NJ
    "07628": 15.00, // Dumont, NJ
    "07646": 15.00, // New Milford, NJ

  };

  // Calculate delivery charge based on zip code
  const calculateDeliveryCharge = (zip) => {
    return deliveryCharges[zip] || null; // Return null if the zip code is not found
  };

  const deliveryCharge = calculateDeliveryCharge(zipCode);

  return (
    <div>
      {deliveryCharge !== null ? (
        <p>Delivery Fee: ${deliveryCharge.toFixed(2)}</p>
      ) : (
        <p>Delivery not available for this zip code.</p>
      )}
    </div>
  );
};

// Export the calculateDeliveryCharge function for use in PlaceOrder.jsx
DeliveryChargeCalculator.calculateDeliveryCharge = (zip) => {
  const deliveryCharges = {
    "07631": 5.00, // Englewood, NJ
    "07666": 8.00, // Englewood, NJ (shared with Teaneck)
    "07608": 8.00, // Teaneck, NJ
    "07621": 8.00, // Bergenfield, NJ
    "07670": 8.00, // Tenafly, NJ
    "07601": 6.00, // Hackensack, NJ
    "07632": 8.00, // Englewood Cliffs, NJ
    "07605": 12.00, // Leonia, NJ
    "07628": 15.00, // Dumont, NJ
    "07646": 15.00, // New Milford, NJ
  };
    
  return deliveryCharges[zip] || null; // Return null if the zip code is not found
};

export default DeliveryChargeCalculator;