import PayOut from '../models/PayOutModel.js';
import PayOutDetail from '../models/PayOutDetailModel.js';
import User from '../models/UserModel.js';
import DocNumberModel from '../models/DocNumberModel.js';
import sequelize from '../config/Database.js';
import Cart from '../models/CartModel.js';
import Warehouse from '../models/WareHouseModel.js';
import { Op } from "sequelize";

export const getPayOuts = async (req, res) => {
    const search = req.query.search || ''; // ถ้าไม่มีค่า search จะใช้ค่าเริ่มต้นเป็นค่าว่าง
    try {
        let response;
        if (req.role === "admin") {
            response = await PayOut.findAll({
                attributes: ['id', 'uuid', 'userId', 'doc_number', 'title', 'doc_date', 'status'],
                include: [
                    {
                        model: User,
                        attributes: ['id', 'fname', 'lname', 'email'],
                        where: {
                            [Op.or]: [
                                { fname: { [Op.like]: `%${search}%` } },
                                { lname: { [Op.like]: `%${search}%` } },
                            ]
                        },
                        required: false // ทำให้การรวมนี้เป็น optional
                    }
                ],
                where: {
                    [Op.or]: [
                        { title: { [Op.like]: `%${search}%` } },
                        { doc_number: { [Op.like]: `%${search}%` } },
                        { '$User.fname$': { [Op.like]: `%${search}%` } },
                        { '$User.lname$': { [Op.like]: `%${search}%` } },
                    ]
                }
            });
        } else {
            response = await PayOut.findAll({
                attributes: ['id', 'uuid', 'userId', 'doc_number', 'title', 'doc_date', 'status'],
                where: {
                    userId: req.userId,
                    [Op.or]: [
                        { title: { [Op.like]: `%${search}%` } },
                        { doc_number: { [Op.like]: `%${search}%` } },
                    ]
                },
                include: [
                    {
                        model: User,
                        attributes: ['id', 'fname', 'lname', 'email'],

                    }
                ]
            });
        }
        res.status(200).json(response);
    } catch (error) {
        res.status(400).json({ msg: error.message });
    }
};

export const getPayOutById = async (req, res) => {
    try {
        const payout = await PayOut.findOne({
            where: {
                uuid: req.params.id
            },
        });
        if (!payout) return res.status(404).json({ msg: "ไม่พบข้อมูล !" });
        const response = await PayOut.findOne({
            attributes: ['id', 'uuid', 'userId', 'doc_number', 'title', 'doc_date', 'status'],
            where: {
                id: payout.id
            },
            include: [
                {
                    model: User,
                    attributes: ['id', 'fname', 'lname'],
                }
            ]
        });

        res.status(200).json(response);
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
};

const generateDocNumber = async () => {
    try {
        let docNumber = await DocNumberModel.findOne();

        if (!docNumber) {
            docNumber = await DocNumberModel.create({
                last_doc_number: 0
            });
        }

        const lastNumber = docNumber.last_doc_number;

        const nextNumber = lastNumber + 1;
        const newDocNumber = `IF${nextNumber.toString().padStart(5, '0')}`;

        await docNumber.update({ last_doc_number: nextNumber }, {
            where: {
                id: docNumber.id
            }
        });

        return newDocNumber;
    } catch (error) {
        console.error('Error generating product code:', error);
        throw error;
    }
};

export const createPayOut = async (req, res) => {
    const { userId, title } = req.body;
    const transaction = await sequelize.transaction();

    try {
        if (!userId) {
            return res.status(404).json({ msg: "กรุณาเลือกผู้ใช้งาน !" });
        }

        if (!title) {
            return res.status(404).json({ msg: "กรุณากรอกหัวข้อในการเบิก !" });
        }

        const userData = await User.findOne({ where: { id: userId } });
        if (!userData) {
            return res.status(400).json({ msg: "ไม่พบข้อมูลผู้ใช้งาน !" });
        }

        const newDocNumber = await generateDocNumber();

        const newPayOut = await PayOut.create({
            userId: userData.id,
            title: title,
            doc_date: new Date(),
            doc_number: newDocNumber,
            status: 'pending'
        }, { transaction });

        const payoutId = newPayOut.id;

        // ตรวจสอบข้อมูล cart ที่ userId นั้นเป็นคนเพิ่มไว้
        let cartItems;
        const requestingUser = await User.findOne({ where: { id: req.userId } }); // สมมติว่า req.userId คือ ID ของผู้ใช้ที่ทำการร้องขอ
        if (requestingUser.role === 'admin') {
            cartItems = await Cart.findAll({ where: { userId: req.userId } }); // ใช้ cartItems ของ admin
        } else {
            cartItems = await Cart.findAll({ where: { userId: userData.id } }); // ใช้ cartItems ของ user ที่ถูกเลือก
        }

        // ถ้าไม่มีข้อมูลในตาราง cart ให้แจ้งเตือน
        if (!cartItems || cartItems.length === 0) {
            return res.status(400).json({ msg: "ไม่พบรายการสินค้าในตะกร้าของผู้ใช้งานนี้ !" });
        }

        // สร้าง PayOutDetails
        const payoutDetails = cartItems.map(item => ({
            productId: item.productId,
            quantity: item.quantity,
            payoutId: payoutId
        }));

        await PayOutDetail.bulkCreate(payoutDetails, { transaction });

        // // อัปเดต warehouse.quantity
        // for (const detail of payoutDetails) {
        //     const warehouseItem = await Warehouse.findOne({ where: { productId: detail.productId } });
        //     if (warehouseItem) {
        //         warehouseItem.quantity -= detail.quantity;
        //         await warehouseItem.save({ transaction });
        //     } else {
        //         throw new Error(`ไม่พบสินค้าในคลังสำหรับ productId: ${detail.productId}`);
        //     }
        // }

        // ลบรายการในตาราง cart ที่ตรงกับ userId
        await Cart.destroy({ where: { userId: userId }, transaction });
        
        await transaction.commit();
        res.status(201).json({ msg: 'สร้าง PayOut สำเร็จ' });
    } catch (error) {
        await transaction.rollback();
        res.status(500).json({ msg: error.message });
    }
};