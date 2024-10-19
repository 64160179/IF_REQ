import BuyIn from "../models/BuyInModel.js";
import Product from "../models/ProductModel.js";
import WareHouse from "../models/WareHouseModel.js";

export const getBuyIn = async (req, res) => {
    try {
        const buyInData = await BuyIn.findAll({
            attributes: ['id', 'productId', 'doc_number', 'title', 'quantity', 'price', 'summary'],
            include: [{ model: Product, attributes: ['id', 'name'] }]
        });

         // จัดกลุ่มข้อมูลตาม productId และรวมค่า quantity
         const groupedData = buyInData.reduce((acc, buyIn) => {
            const productId = buyIn.productId;
            if (!acc[productId]) {
                acc[productId] = {
                    ...buyIn.dataValues,
                    quantity: 0
                };
            }
            acc[productId].quantity += parseFloat(buyIn.quantity);
            return acc;
        }, {});

        // แปลงข้อมูลจาก object เป็น array และแปลงค่า quantity ให้เป็นทศนิยม 2 ตำแหน่ง
        const result = Object.values(groupedData).map(item => ({
            ...item,
            quantity: parseFloat(item.quantity.toFixed(2))
        }));

        res.status(200).json(result);
    } catch (error) {
        res.status(400).json({ msg: error.message });
    }
};

export const createBuyIn = async (req, res) => {
    const { productId, doc_number, title, quantity, } = req.body;
    try {
        const productData = await Product.findByPk(productId);
        if (!productData) {
            return res.status(404).json({ msg: "ไม่พบสินค้าในระบบ !" });
        }

        await BuyIn.create({ 
            productId: productData.id,
            doc_number: doc_number,
            title: title,
            quantity: quantity,
            price: '0.00',
            summary: '0.00'
        });

        // ตรวจสอบว่ามีข้อมูลในตาราง WareHouse สำหรับ productId นั้น ๆ หรือไม่
        const wareHouseData = await WareHouse.findOne({ where: { productId: productData.id } });

        if (wareHouseData) {
            // ถ้ามีข้อมูลอยู่แล้ว ให้เพิ่มค่า quantity
            await WareHouse.update({
                quantity: parseFloat(wareHouseData.quantity) + parseFloat(quantity)
            }, {
                where: {
                    productId: productData.id
                }
            });
        } else {
            // ถ้าไม่มีข้อมูล ให้สร้างข้อมูลใหม่
            await WareHouse.create({
                productId: productData.id,
                quantity: parseFloat(quantity),
                price: '0.00',
                summary: '0.00'
            });
            console.log(`Created new warehouse entry for productId ${productData.id}`);
        }

        res.status(201).json({ msg: "เพิ่มการซื้อเข้าสำเร็จ !" });
    } catch (error) {
        res.status(400).json({ msg: error.message });
    }
};

