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
                    attributes: ['id', 'payoutId', 'productId', 'quantity', 'note'],
                    include: [
                        {
                            model: Products,
                            attributes: ['id', 'name', 'countingunitId'],
                            include: {
                                model: CountingUnits,
                                attributes: ['name']
                            }
                        }
                    ]
                },
                {
                    model: Users,
                    attributes: ['id', 'fname', 'lname']
                }
            ]
        });

        if (!payOutData) {
            return res.status(404).json({ msg: 'ไม่พบข้อมูล PayOut ที่ต้องการ' });
        }

        res.status(200).json(payOutData);
    } catch (error) {
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
    const { quantityApprove, notes } = req.body;

    try {
        // อัปเดตข้อมูลในฐานข้อมูลตาม payoutDetail.id
        for (const id in quantityApprove) {
            const quantity = quantityApprove[id];
            const note = notes[id] || null;

            console.log(`Updating PayOutDetail with id: ${id}, quantity_approve: ${quantity}, note: ${note}`);

            const [updated] = await PayOutDetail.update(
                { quantity_approved: quantity, note: note },
                { where: { id } }
            );

            if (updated === 0) {
                console.log(`No PayOutDetail found with id: ${id}`);
            }
        }

        // ดึง payoutId และ productId จาก PayOutDetail
        const payoutDetails = await PayOutDetail.findAll({
            where: {
                id: Object.keys(quantityApprove)
            },
            attributes: ['payoutId', 'productId', 'quantity_approved']
        });

        const uniquePayoutIds = [...new Set(payoutDetails.map(detail => detail.payoutId))];

        // อัปเดตสถานะในตาราง payout จาก pending เป็น approved
        for (const payoutId of uniquePayoutIds) {
            await PayOut.update(
                { status: 'approved' },
                { where: { id: payoutId } }
            );
        }

        // อัปเดต warehouse.quantity
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