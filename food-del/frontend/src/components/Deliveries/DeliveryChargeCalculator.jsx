import React from "react";

const DeliveryChargeCalculator = ({ zipCode }) => {
  // Delivery charges based on zip codes
  const deliveryCharges = {
    "07631": 5, // Englewood, NJ
    "07666": 7, // Englewood, NJ (shared with Teaneck)
    "07608": 7, // Teaneck, NJ
    "07621": 7, // Bergenfield, NJ
    "07670": 7, // Tenafly, NJ
    "07601": 15, // Hackensack, NJ
    // "07652": 7, // Paramus, NJ
    "07450": 7, // Ridgewood, NJ
    "07650": 7, // Palisades Park, NJ
  };

  // Calculate delivery charge based on zip code
  const calculateDeliveryCharge = (zip) => {
    return deliveryCharges[zip] || 10; // Default to $10 if zip code is not found
  };

  const deliveryCharge = calculateDeliveryCharge(zipCode);

  return (
    <div>
      <p>Delivery Fee: ${deliveryCharge}</p>
    </div>
  );
};

export default DeliveryChargeCalculator;