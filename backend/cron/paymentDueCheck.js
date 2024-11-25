const cron = require('node-cron');
const Lead = require('../models/Lead');
const Notification = require('../models/Notification');
const Pusher = require('pusher');

const pusher = new Pusher({
    appId: process.env.PUSHER_APP_ID,
    key: process.env.PUSHER_KEY,
    secret: process.env.PUSHER_SECRET,
    cluster: process.env.PUSHER_CLUSTER,
    useTLS: true
});

// Function to check payment due dates
const checkPaymentDueDates = async () => {
    try {
        const currentDate = new Date();
        // Find all unpaid leads with payment due dates
        const leads = await Lead.find({
            pendingAmountDueDate: { $exists: true },
            paymentDone: { $ne: true }
        });

        for (const lead of leads) {
            const dueDate = new Date(lead.pendingAmountDueDate);
            const differenceInDays = (dueDate - currentDate) / (1000 * 3600 * 24);
            
            let message;
            let type;

            if (differenceInDays < 0) {
                message = `Payment for ${lead.companyName} is overdue by ${Math.abs(Math.ceil(differenceInDays))} days`;
                type = 'payment_overdue';
            } else if (differenceInDays <= 3) {
                message = `Payment for ${lead.companyName} is due in ${Math.ceil(differenceInDays)} days`;
                type = 'payment_due_soon';
            } else if (differenceInDays <= 7) {
                message = `Payment for ${lead.companyName} is due in ${Math.ceil(differenceInDays)} days`;
                type = 'payment_due_week';
            }

            if (message) {
                // Check for existing notification today
                const existingNotification = await Notification.findOne({
                    relatedId: lead._id,
                    type: type,
                    createdAt: {
                        $gte: new Date(currentDate.setHours(0, 0, 0, 0))
                    }
                });

                if (!existingNotification) {
                    const newNotification = new Notification({
                        message,
                        type,
                        relatedId: lead._id,
                        dueDate: lead.pendingAmountDueDate,
                        read: false,
                        amount: lead.totalServiceFeesCharged
                    });

                    await newNotification.save();

                    // Trigger real-time notification
                    pusher.trigger('payment-alerts', 'payment-status', {
                        message,
                        leadId: lead._id,
                        dueDate: lead.pendingAmountDueDate,
                        notificationId: newNotification._id,
                        type,
                        companyName: lead.companyName,
                        amount: lead.totalServiceFeesCharged
                    });

                    console.log(`Payment notification created for ${lead.companyName}: ${message}`);
                }
            }
        }
    } catch (error) {
        console.error('Error in payment due check cron job:', error);
    }
};

// Schedule the cron job to run every minute during testing
const initPaymentDueCheck = () => {
    // For testing: run every minute
    cron.schedule('* * * * *', () => {
        console.log('Running payment due check...');
        checkPaymentDueDates();
    });

    // Also run immediately when the server starts
    checkPaymentDueDates();
};

module.exports = initPaymentDueCheck; 