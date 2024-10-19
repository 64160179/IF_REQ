import PayOut from '../models/PayOutModel.js';
import User from '../models/UserModel.js';
import DocNumberModel from '../models/DocNumberModel.js';
import { Op } from 'sequelize';

export const getPayOuts = async (req, res) => {
    try {
        let response;
        if (req.role === "admin") {
            response = await PayOut.findAll({
                attributes: ['id', 'uuid', 'userId', 'doc_number', 'title', 'doc_date', 'status'],
                include: [
                    {
                        model: User,
                        attributes: ['id', 'fname', 'lname', 'email']
                    }
                ]
            });
        } else {
            response = await PayOut.findAll({
                attributes: ['id','uuid', 'userId', 'doc_number', 'title', 'doc_date', 'status'],
                where: {
                    userId: req.userId
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
        });

        return res.status(201).json(newPayOut);
    } catch (error) {
        console.error('Error creating PayOut:', error);
        return res.status(500).json({ msg: error.message });
    }
};