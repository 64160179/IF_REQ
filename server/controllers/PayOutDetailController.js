import PayOutDetail from "../models/PayOutDetailModel.js";
import PayOut from "../models/PayOutModel.js";
import Products from "../models/ProductModel.js";
import CountingUnits from "../models/CountingUnitModel.js";
import Users from "../models/UserModel.js";
import WareHouses from "../models/WareHouseModel.js";

export const getPayOutDetailsByIdToConfirm = async (req, res) => {
    const { payoutId } = req.params;
    try {
        const payOutData = await PayOut.findOne({
            where: { id: payoutId },
            attributes: ['id', 'userId', 'doc_number', 'doc_date', 'title', 'status'],
            include: [
                {
                    model: PayOutDetail,
                    attributes: ['id', 'payoutId', 'productId', 'quantity', 'quantity_approved', 'userId_approved', 'note'],
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
                            model: Users,
                            as: 'approvedBy', // Use the alias defined in the PayOutDetail association
                            attributes: ['id', 'fname', 'lname']
                        }
                    ]
                },
                {
                    model: Users,
                    as: 'user', // Use the alias defined for the creator of the payout
                    attributes: ['id', 'fname', 'lname']
                }
            ]
        });

        if (!payOutData) {
            return res.status(404).json({ msg: 'ไม่พบข้อมูล PayOut ที่ต้องการ' });
        }

        res.status(200).json(payOutData);
    } catch (error) {
        console.error('Error retrieving PayOut details:', error);
        res.status(400).json({ msg: error.message });
    }
};


export const getPayOutDetailByIdToSummary = async (req, res) => {
    try {
        const payOutData = await PayOutDetail.findAll({
            attributes: ['id', 'payoutId', 'productId', 'quantity_approved', 'note'],
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

export const approvePayOutDetails = async (req, res) => {
    const { quantityApprove, notes, userId } = req.body; // Receive userId from request

    try {
        // Update PayOutDetail records based on the quantityApprove object
        for (const id of Object.keys(quantityApprove)) {
            const quantity = quantityApprove[id];
            const note = notes[id] || null;

            console.log(`Updating PayOutDetail with id: ${id}, quantity_approved: ${quantity}, note: ${note}, userId_approved: ${userId}`);

            const [updated] = await PayOutDetail.update(
                { quantity_approved: quantity, note: note, userId_approved: userId }, // Ensure userId_approved is being set
                { where: { id } }
            );

            if (updated === 0) {
                console.log(`No PayOutDetail found with id: ${id}`);
            }
        }

        // Retrieve payoutId and productId from updated PayOutDetails
        const payoutDetails = await PayOutDetail.findAll({
            where: { id: Object.keys(quantityApprove) },
            attributes: ['payoutId', 'productId', 'quantity_approved']
        });

        // Get unique payoutIds for updating status
        const uniquePayoutIds = [...new Set(payoutDetails.map(detail => detail.payoutId))];

        // Update status in the PayOut table from pending to approved
        await PayOut.update(
            { status: 'approved' },
            { where: { id: uniquePayoutIds } } // Update all matching payouts at once
        );

        // Update warehouse quantities
        for (const detail of payoutDetails) {
            const warehouseItem = await WareHouses.findOne({ where: { productId: detail.productId } });

            if (warehouseItem) {
                const newQuantity = warehouseItem.quantity - detail.quantity_approved;

                await WareHouses.update(
                    { quantity: newQuantity },
                    { where: { productId: detail.productId } }
                );

                console.log(`Updated WareHouse for productId: ${detail.productId}, new quantity: ${newQuantity}`);
            } else {
                console.log(`No WareHouse item found for productId: ${detail.productId}`);
            }
        }

        res.status(200).json({ msg: 'อัปเดตข้อมูลสำเร็จ' });
    } catch (error) {
        console.error('Error updating PayOutDetail:', error);
        res.status(400).json({ msg: error.message });
    }
};
