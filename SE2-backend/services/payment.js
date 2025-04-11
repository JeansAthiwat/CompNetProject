import cron from 'node-cron';
import Reservation from '../models/reservationModel.js';
import { updatePayment } from '../controllers/reservationController.js';

console.log('🔄 Payment system is running...');

// 🔄 ตั้ง Cron Job ให้เช็ค reservation ทุกชั่วโมง
cron.schedule('* * * * *', async () => {
    console.log('🔄 Checking reservations for payment update...');

    try {
        const now = new Date();
        const reservations = await Reservation.find({
            payment_date: { $lte: now },
            status: 'pending'
        });

        for (const reservation of reservations) {
            console.log(`✅ Updating payment for reservation ${reservation._id}`);

            // จำลอง req, res เพื่อเรียกใช้ updatePayment()
            const req = { params: { id: reservation._id } };
            const res = { 
                json: (data) => console.log('📢 Payment Update Response:', data),
                status: (code) => ({ json: (data) => console.log(`❌ Error ${code}:`, data) })
            };

            await updatePayment(req, res);
        }
    } catch (error) {
        console.error('❌ Error processing payments:', error);
    }
});

export default cron;