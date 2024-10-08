import CountingUnits from '../models/CountingUnitModel.js';
import { Op } from "sequelize";

export const getCountingUnit = async (req, res) => {
    const search = req.query.search || '';
    try {
        const response = await CountingUnits.findAll({
            attributes: ['id', 'uuid', 'name'],
            where: {
                [Op.or]: [
                    { name: { [Op.like]: `%${search}%` } }
                ]
            }
        });
        res.status(200).json(response);
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
}

export const getCountingUnitToShow = async (req, res) => {
    try {
        const response = await CountingUnits.findAll({
            attributes: ['id', 'uuid', 'name'],
            order: [['name', 'ASC']]
        });
        res.status(200).json(response);
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
}

export const getCountingUnitById = async (req, res) => {
    try {
        const response = await CountingUnits.findOne({
            attributes: ['id', 'uuid', 'name'],
            where: {
                uuid: req.params.id
            }
        });
        res.status(200).json(response);
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
}

export const createCountingUnit = async (req, res) => {
    const { name } = req.body;
    const existingCountingUnit = await CountingUnits.findOne({ where: { name } });
    if (existingCountingUnit) return res.status(400).json({ msg: "หน่วยนับนี้มีอยู่ในระบบแล้ว !" });
    try {
        await CountingUnits.create({
            name: name
        });
        res.status(201).json({ msg: "เพิ่มหน่วยนับสำเร็จ !" });
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
}

export const updateCountingUnit = async (req, res) => {
    const countingUnit = await CountingUnits.findOne({
        where: {
            uuid: req.params.id
        }
    });
    if (!countingUnit) return res.status(404).json({ msg: "ไม่พบข้อมูล !" });

    const { name } = req.body;
    let updateFields = {};

    if (name && name !== countingUnit.name) {
        const existingCountingUnit = await CountingUnits.findOne({ where: { name } });
        if (existingCountingUnit) return res.status(400).json({ msg: "หน่วยนับนี้มีอยู่ในระบบแล้ว !" });
        updateFields.name = name;
    }

    try {
        await CountingUnits.update(updateFields, {
            where: {
                uuid: req.params.id
            }
        });
        res.status(200).json({ msg: "อัปเดตหน่วยนับสำเร็จ !" });
    } catch (error) {
        res.status(500).json({ msg: "เกิดข้อผิดพลาดในการอัปเดตข้อมูล !" });
    }
}

export const deleteCountingUnit = async (req, res) => {
    const countingUnit = await CountingUnits.findOne({
        where: {
            uuid: req.params.id
        }
    });
    if (!countingUnit) return res.status(404).json({ msg: "ไม่พบข้อมูล !" });
    try {
        await CountingUnits.destroy({
            where: {
                id: countingUnit.id
            }
        });
        res.status(200).json({ msg: "ลบหน่วยนับสำเร็จ !" });
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
}