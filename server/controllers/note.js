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

        // อัปเดตสถานะในตาราง payout จาก pending เป็น approved
        const payoutIds = Object.keys(quantityApprove).map(id => parseInt(id));
        const uniquePayoutIds = [...new Set(payoutIds)];

        for (const payoutId of uniquePayoutIds) {
            await PayOut.update(
                { status: 'approved' },
                { where: { id: payoutId } }
            );
        }

        res.status(200).json({ msg: 'อัปเดตข้อมูลสำเร็จ' });
    } catch (error) {
        console.error('Error updating PayOutDetail:', error);
        res.status(400).json({ msg: error.message });
    }
};