const { cartId } = req.params;
const { quantity } = req.body;
try {
    const cartItem = await Cart.findByPk(cartId);
    if (!cartItem) {
        return res.status(404).json({ msg: "ไม่พบสินค้าในตะกร้า !" });
    }
    cartItem.quantity = quantity;
    await cartItem.save();
    res.status(200).json({ msg: "อัปเดตจำนวนสินค้าในตะกร้าสำเร็จ !" });
} catch (error) {
    res.status(500).json({ msg: error.message });
}