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
        const cartItems = await Cart.findAll({ where: { userId: userData.id } });

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

        // บันทึก payoutDetail
        await PayOutDetail.bulkCreate(payoutDetails, { transaction });

        await transaction.commit();

        return res.status(201).json(newPayOut);
    } catch (error) {
        await transaction.rollback();
        console.error('Error creating PayOut and details:', error);
        return res.status(500).json({ msg: error.message });
    }
};