import WareHouse from '../models/WareHouseModel.js';

export const getWareHouses = async (req, res) => {
    try {
        const response = await WareHouse.findAll({
            attributes: ['id', 'productId', 'quantity', 'price', 'summary'],
        });
        res.status(200).json(response);
    } catch (error) {
        res.status(400).json({msg: error.message});
    }
};
