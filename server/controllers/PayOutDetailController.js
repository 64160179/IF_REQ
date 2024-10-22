import PayOutDetail from "../models/PayOutDetailModel.js";
import PayOut from "../models/PayOutModel.js";
import Products from "../models/ProductModel.js";
import CountingUnits from "../models/CountingUnitModel.js";

export const getPayOutDetailsByIdToConfirm = async (req, res) => {
    try {
        const payOutData = await PayOutDetail.findOne({
            attributes: ['id', 'payoutId', 'productId', 'quantity', 'note'],
            include: [
                {
                    model: Products,
                    attributes: ['id', 'name', 'countingunitId'],
                    include: {
                        model: CountingUnits,
                        attributes: ['name']
                    }
                },
                {
                    model: PayOut,
                    attributes: ['id', 'doc_number', 'doc_date', 'title', 'status']
                }
            ]
        });

        res.status(200).json(payOutData);
    } catch (error) {
        res.status(400).json({ msg: error.message });
    }
};

export const getPayOutDetailByIdToSummary = async (req, res) => {
    try {
        const payOutData = await PayOutDetail.findAll({
            attributes: ['id', 'payoutId', 'productId', 'quantity', 'note'],
            include: [
                {
                    model: Products,
                    attributes: ['id', 'name']
                }
            ]
        });

        const groupedData = payOutData.reduce((acc, payOut) => {
            const productId = payOut.productId;
            if (!acc[productId]) {
                acc[productId] = {
                    ...payOut.dataValues,
                    quantity: 0
                };
            }
            acc[productId].quantity += parseFloat(payOut.quantity);
            return acc;

        }, {});

        const result = Object.values(groupedData).map(item => ({
            ...item,
            quantity: parseFloat(item.quantity.toFixed(2))
        }));

        res.status(200).json(result);
    } catch (error) {
        res.status(400).json({ msg: error.message });
    }
};