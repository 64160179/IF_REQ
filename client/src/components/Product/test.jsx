const addToCart = async (productId) => {
  try {
      // ดึงข้อมูลตะกร้าปัจจุบัน
      const cartResponse = await axios.get(`http://localhost:5000/cart/${user.id}`);
      const cartItems = cartResponse.data;

      // ตรวจสอบจำนวน productId ที่แตกต่างกันในตะกร้า
      const uniqueProductIds = new Set(cartItems.map(item => item.productId));
      if (uniqueProductIds.size >= 8) {
          await Swal.fire({
              title: 'ไม่สามารถเพิ่มสินค้าได้',
              text: 'ไม่สามารถเพิ่มสินค้ามากกว่า 8 ชนิดในตะกร้าได้',
              icon: 'warning',
              confirmButtonText: 'ตกลง'
          });
          return;
      }

      // เพิ่มสินค้าใหม่ในตะกร้า
      const response = await axios.post('http://localhost:5000/cart', {
          userId: user.id,
          productId: productId,
          quantity: 1
      });
      console.log('Product added to cart:', response.data);
      fetchCartItems(); // รีเฟรชข้อมูลตะกร้า
  } catch (error) {
      console.error('Error adding product to cart:', error);
  }
};