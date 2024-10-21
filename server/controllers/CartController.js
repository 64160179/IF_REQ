import Cart from "../models/CartModel.js";
import Product from "../models/ProductModel.js";
import Users from "../models/UserModel.js";
import CountingUnit from "../models/CountingUnitModel.js";

export const getUserCart = async (req, res) => {
    const { userId } = req.params;
    try {
        const cartItems = await Cart.findAll({
            where: { userId: userId },
            attributes: ['id', 'quantity', 'productId'],
            include: {
                model: Product,
                attributes: ['id', 'code', 'name', 'countingunitId'],
                include: {
                    model: CountingUnit, // เรียกใช้ relation ของ CountingUnit
                    attributes: ['name'], // ดึงข้อมูลชื่อของ CountingUnit
                }
            }
        });
        res.status(200).json(cartItems);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching cart data' });
    }
};

// เพิ่มสินค้าเข้า cart
export const addProductToCart = async (req, res) => {
    const { productId, userId, quantity } = req.body;
    try {
        const productData = await Product.findByPk(productId);
        if (!productData) {
            return res.status(404).json({ msg: "ไม่พบสินค้าในระบบ !" });
        }

        const userData = await Users.findByPk(userId);
        if (!userData) {
            return res.status(404).json({ msg: "ไม่พบข้อมูลผู้ใช้ในระบบ !" });
        }

        // ตรวจสอบว่ามี productId ที่เหมือนกันในตะกร้าหรือไม่
        const existingCartItem = await Cart.findOne({
            where: { productId: productData.id, userId: userData.id }
        });

        if (existingCartItem) {
            // ถ้ามี ให้ทำการอัปเดต cart.quantity โดยการบวกเพิ่มไปอีก 1
            existingCartItem.quantity += quantity;
            await existingCartItem.save();
            res.status(200).json({ msg: "อัปเดตจำนวนสินค้าในตะกร้าสำเร็จ !" });
        } else {
            // ถ้าไม่มี ให้เพิ่มสินค้าเข้าไปในตะกร้า
            await Cart.create({
                productId: productData.id,
                userId: userData.id,
                quantity: quantity
            });
            res.status(201).json({ msg: "เพิ่มลงตะกร้าสำเร็จ !" });
        }
    } catch (error) {
        res.status(400).json({ msg: error.message });
    }
};

export const removeProductFromCart = async (req, res) => {
    const { cartId } = req.params;
    try {
        const cartItem = await Cart.findByPk(cartId);
        if (!cartItem) {
            return res.status(404).json({ msg: "ไม่พบสินค้าในตะกร้า !" });
        }
        await cartItem.destroy();
        res.status(200).json({ msg: "ลบสินค้าออกจากตะกร้าสำเร็จ !" });
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
};