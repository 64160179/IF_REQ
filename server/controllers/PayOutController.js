import PayOut from '../models/PayOutModel.js';

export const getPayOuts = async (req, res) => {
    try {
        const response = await PayOut.findAll({
            attributes: ['id', 'productId', 'quantity', 'price', 'summary'],
        });
        res.status(200).json(response);
    } catch (error) {
        res.status(400).json({msg: error.message});
    }
};