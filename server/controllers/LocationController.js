import Locations from "../models/LocationModel.js";
import { Op } from "sequelize";

export const getLocation = async (req, res) => {
    const search = req.query.search || '';
    try {
        const response = await Locations.findAll({
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

export const getLocationById = async (req, res) => {
    try {
        const response = await Locations.findOne({
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

export const createLocation = async (req, res) => {
    const { name } = req.body;
    const existingLocation = await Locations.findOne({ where: { name } });
    if (existingLocation) return res.status(400).json({ msg: "สถานที่นี้มีอยู่ในระบบแล้ว !" });
    
    try {
        await Locations.create({
            name: name
        });
        res.status(201).json({ msg: "เพิ่มสถานที่สำเร็จ !" });
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
}

export const updateLocation = async (req, res) => {
    const location = await Locations.findOne({
        where: {
            uuid: req.params.id
        }
    });
    if (!location) return res.status(404).json({ msg: "ไม่พบข้อมูล !" });

    const { name } = req.body;
    let updateFields = {};

    if (name && name !== location.name) {
        const existingLocation = await Locations.findOne({ where: { name } });
        if (existingLocation) return res.status(400).json({ msg: "สถานที่นี้มีอยู่ในระบบแล้ว !" });
        updateFields.name = name;
    }

    try {
        await Locations.update(updateFields, {
            where: {
                uuid: req.params.id
            }
        });
        res.status(200).json({ msg: "อัปเดตสถานที่สำเร็จ !" });
    } catch (error) {
        res.status(500).json({ msg: "เกิดข้อผิดพลาดในการอัปเดตข้อมูล !" });
    }
}

export const deleteLocation = async (req, res) => {
    const location = await Locations.findOne({
        where: {
            uuid: req.params.id
        }
    });
    if (!location) return res.status(404).json({ msg: "ไม่พบข้อมูล !" });
    try {
        await Locations.destroy({
            where: {
                id: location.id
            }
        });
        res.status(200).json({ msg: "ลบสถานที่สำเร็จ !" });
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
}