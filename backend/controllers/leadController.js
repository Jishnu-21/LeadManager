const Lead = require('../models/Lead');
const ChannelPartner = require('../models/ChannelPartner');
const Notification = require('../models/Notification');
const pusher = require('../config/pusher');


const cloudinary = require('../config/cloudinary');

// Helper function to check if a payment is due soon
const checkPaymentDueSoon = async (lead) => {
    if (lead.paymentDueDate && !lead.paymentDone) {
        const dueDate = new Date(lead.pendingAmountDueDate);
        const now = new Date();
        const differenceInDays = (dueDate - now) / (1000 * 3600 * 24);
        
        // Create different messages based on due date
        let message;
        let type;

        if (differenceInDays < 0) {
            // Payment is overdue
            message = `Payment for ${lead.companyName} is overdue by ${Math.abs(Math.ceil(differenceInDays))} days`;
            type = 'payment_overdue';
        } else if (differenceInDays <= 3) {
            // Payment is due within 3 days
            message = `Payment for ${lead.companyName} is due in ${Math.ceil(differenceInDays)} days`;
            type = 'payment_due_soon';
        } else if (differenceInDays <= 7) {
            // Payment is due within a week
            message = `Payment for ${lead.companyName} is due in ${Math.ceil(differenceInDays)} days`;
            type = 'payment_due_week';
        }

        if (message) {
            // Check if we already have a similar notification today
            const existingNotification = await Notification.findOne({
                relatedId: lead._id,
                type: type,
                createdAt: {
                    $gte: new Date(now.setHours(0, 0, 0, 0))
                }
            });

            if (!existingNotification) {
                // Create a new notification
                const newNotification = new Notification({
                    message,
                    type,
                    relatedId: lead._id,
                    dueDate: lead.pendingAmountDueDate,
                    read: false,
                    amount: lead.totalServiceFeesCharged
                });

                await newNotification.save();

                // Trigger Pusher event
                pusher.trigger('payment-alerts', 'payment-status', {
                    message,
                    leadId: lead._id,
                    dueDate: lead.pendingAmountDueDate,
                    notificationId: newNotification._id,
                    type,
                    companyName: lead.companyName,
                    amount: lead.totalServiceFeesCharged
                });

                return newNotification;
            }
        }
    }
    return null;
};

const createLead = async (req, res) => {
    try {
        const leadData = req.body;
        
        // Debugging: Log the received data
        console.log('Received lead data:', JSON.stringify(leadData, null, 2));

        // Sanitize the platform data
        const sanitizePlatforms = (platforms) => {
            if (!platforms) return undefined;
            if (typeof platforms === 'string') {
                // If it's a string, try to parse it as JSON
                try {
                    platforms = JSON.parse(platforms);
                } catch (e) {
                    // If parsing fails, split the string by comma
                    platforms = platforms.split(',').map(p => p.trim());
                }
            }
            // If it's an array, filter out any empty strings
            if (Array.isArray(platforms)) {
                platforms = platforms.filter(p => p && p.trim() !== '');
            }
            // If the array is empty after filtering, return undefined
            return platforms.length > 0 ? platforms : undefined;
        };

        leadData.ecommerceListingPlatforms = sanitizePlatforms(leadData.ecommerceListingPlatforms);
        leadData.quickCommercePlatforms = sanitizePlatforms(leadData.quickCommercePlatforms);

        // Debugging: Log the sanitized data
        console.log('Sanitized lead data:', JSON.stringify(leadData, null, 2));

        // Validate required fields
        const requiredFields = [
            'contactNumber', 'email', 'bdaName', 'companyName', 'clientName',
            'clientEmail', 'clientDesignation', 'companyOffering',
            'servicesRequested', 'totalServiceFeesCharged', 'gstBill','paymentDone', 
            'servicePromisedByBDA'
        ];

        for (const field of requiredFields) {
            if (!leadData[field]) {
                return res.status(400).json({ message: `${field} is required.` });
            }
        }

        // Check if the contact number is valid
        const isValidPhoneNumber = /^\d{10}$/.test(leadData.contactNumber);
        if (!isValidPhoneNumber) {
            return res.status(400).json({ message: 'Contact number must be exactly 10 digits.' });
        }

        // Handle file uploads to Cloudinary
        if (req.files) {
            if (req.files.quotationFile) {
                const result = await cloudinary.uploader.upload(req.files.quotationFile[0].path, {
                    folder: 'quotations',
                });
                leadData.quotationFile = result.secure_url;
            }
            if (req.files.paymentProof) {
                const result = await cloudinary.uploader.upload(req.files.paymentProof[0].path, {
                    folder: 'payment_proofs',
                });
                leadData.paymentProof = result.secure_url;
            }
        }

        // Handle package details
        if (leadData.packages) {
            if (!leadData.packageType) {
                return res.status(400).json({ message: 'Package type is required when a package is selected.' });
            }
        } else {
            if (leadData.servicesRequested.includes('Website Development') && !leadData.websiteDevelopmentTime) {
                return res.status(400).json({ message: 'Website Development Time Period is required.' });
            }
            if (leadData.servicesRequested.includes('Branding') && !leadData.brandingTime) {
                return res.status(400).json({ message: 'Branding Time Period is required.' });
            }
            if (leadData.servicesRequested.includes('Social Media Management') && !leadData.socialMediaTime) {
                return res.status(400).json({ message: 'Social Media Marketing Time Period is required.' });
            }
        }

        // Convert string arrays to actual arrays if necessary
        ['servicesRequested', 'socialMediaManagementRequirement', 'brandingRequirement'].forEach(field => {
            if (typeof leadData[field] === 'string') {
                try {
                    leadData[field] = JSON.parse(leadData[field]);
                } catch (error) {
                    return res.status(400).json({ message: `Invalid format for ${field}. Expected JSON array.` });
                }
            }
        });

        // Create new lead
        const newLead = new Lead(leadData);
        await newLead.save();

        // Create notification for new lead
        const newLeadNotification = new Notification({
            message: `New lead created for ${newLead.companyName} by ${newLead.bdaName}`,
            type: 'lead_created',
            relatedId: newLead._id,
            read: false
        });
        await newLeadNotification.save();

        // Trigger Pusher event for new lead notification
        pusher.trigger('lead-alerts', 'new-lead', {
            message: newLeadNotification.message,
            leadId: newLead._id,
            notificationId: newLeadNotification._id
        });

        // Check payment status immediately if payment due date is set
        if (newLead.paymentDueDate) {
            console.log('Checking payment due for new lead:', {
                companyName: newLead.companyName,
                paymentDueDate: newLead.paymentDueDate,
                paymentDone: newLead.paymentDone
            });
            const paymentNotification = await checkPaymentDueSoon(newLead);
            if (paymentNotification) {
                console.log('Payment notification created:', paymentNotification.message);
            } else {
                console.log('No payment notification created');
            }
        }

        // Respond with the created lead
        res.status(201).json({
            lead: newLead,
            message: 'Lead created successfully'
        });
    } catch (error) {
        console.error('Error in createLead:', error);
        res.status(400).json({ message: error.message, stack: error.stack });
    }
};

const getLeads = async (req, res) => {
    try {
        const leads = await Lead.find();
        console.log('Fetched leads:', leads);
        if (!leads || leads.length === 0) {
            return res.status(404).json({ message: 'No leads found' });
        }
        res.json(leads);
    } catch (error) {
        console.error('Error in getLeads:', error);
        res.status(500).json({ message: error.message });
    }
};

const getLeadsByBDA = async (req, res) => {
    try {
        const { bdaName } = req.query;
        const leads = await Lead.find({ bdaName });
        res.json(leads);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching leads', error: error.message });
    }
};

const updateLead = async (req, res) => {
    try {
        const { id } = req.params;
        const updatedLead = await Lead.findByIdAndUpdate(id, req.body, { new: true });
        if (!updatedLead) {
            return res.status(404).json({ message: 'Lead not found' });
        }

        // Check if payment is due soon after update
        await checkPaymentDueSoon(updatedLead);

        res.json(updatedLead);
    } catch (error) {
        res.status(500).json({ message: 'Error updating lead', error: error.message });
    }
};

const getNotifications = async (req, res) => {
    try {
        const notifications = await Notification.find().sort({ createdAt: -1 });
        res.json(notifications);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching notifications', error: error.message });
    }
};

const downloadProof = async (req, res) => {
    const { filename } = req.params;
    try {
        const lead = await Lead.findOne({ $or: [{ quotationFile: { $regex: filename } }, { paymentProof: { $regex: filename } }] });
        if (!lead) {
            return res.status(404).send('File not found');
        }
        const fileUrl = lead.quotationFile.includes(filename) ? lead.quotationFile : lead.paymentProof;
        res.redirect(fileUrl);
    } catch (error) {
        console.error("Error retrieving the file:", error);
        res.status(500).send('Error retrieving file');
    }
};

const getDownloadUrl = async (req, res) => {
    const { publicId } = req.query;

    console.log('Received publicId:', publicId);

    try {
        // Remove the version number from the publicId if present
        const cleanPublicId = publicId.replace(/v\d+\//, '');
        console.log('Cleaned publicId:', cleanPublicId);

        // First, let's check if the resource exists and get its type
        const resourceDetails = await cloudinary.api.resource(cleanPublicId);
        console.log('Resource details:', resourceDetails);

        const downloadUrl = cloudinary.utils.private_download_url(cleanPublicId, resourceDetails.format, {
            resource_type: resourceDetails.resource_type,
            type: 'upload',
            attachment: true,
            expires_at: Math.floor(Date.now() / 1000) + 300
        });

        console.log('Generated downloadUrl:', downloadUrl);

        res.json({ downloadUrl });
    } catch (error) {
        console.error('Error in getDownloadUrl:', error);
        res.status(500).json({ 
            message: 'Failed to generate download URL', 
            error: error.message,
            details: error.error ? error.error.message : undefined,
            publicId: publicId
        });
    }
};

module.exports = {
    createLead,
    getLeads,
    getLeadsByBDA,
    updateLead,
    downloadProof,
    getNotifications,
    getDownloadUrl
};