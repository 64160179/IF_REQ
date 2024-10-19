import PayOutDetail from "../models/PayOutDetailModel.js";

export const getPayOutDetails = async (req, res) => {
    try {
        const payOutDetails = await PayOutDetail.findAll();
        res.json(payOutDetails);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};