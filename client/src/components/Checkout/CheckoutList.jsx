import React from 'react';
import { useLocation } from 'react-router-dom';

const CheckoutList = () => {
  const location = useLocation();
  const { cart } = location.state || { cart: [] };

  return (
    <div>
      <h1>Checkout</h1>
      {cart.length > 0 ? (
        <ul>
          {cart.map((item, index) => (
            <li key={index}>
              {item.name} - {item.quantity}
            </li>
          ))}
        </ul>
      ) : (
        <p>ไม่มีสินค้าในตะกร้า</p>
      )}
    </div>
  );
};

export default CheckoutList;