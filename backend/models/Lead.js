const mongoose = require('mongoose');

// Helper function to create a custom field with validation and empty array handling
const createPlatformField = (validPlatforms) => ({
  type: [String],
  set: function(v) {
    // If it's an empty array or falsy value, set it to undefined
    return (Array.isArray(v) && v.length === 0) || !v ? undefined : v;
  },
  validate: {
    validator: function(v) {
      // Allow undefined
      if (v === undefined) return true;
      // Validate non-empty arrays
      return Array.isArray(v) && v.every(platform => validPlatforms.includes(platform));
    },
    message: props => `${props.path} contains invalid platforms: ${props.value}`
  }
});

const leadSchema = new mongoose.Schema({
  // Basic Information
  contactNumber: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  bdaName: {
    type: String,
    required: true,
  },
  companyName: {
    type: String,
    required: true,
  },
  clientName: {
    type: String,
    required: true,
  },
  clientEmail: {
    type: String,
    required: true,
  },
  clientDesignation: {
    type: String,
    required: true,
  },
  alternateContactNo: {
    type: String,
  },
  companyOffering: {
    type: String,
    required: true,
  },

  companyIndustry: {
    type: String,
    required: true,
  },

  // Service Details
  packages: {
    type: String,
    enum: ['Shuruvat', 'Unnati','NA'],
  },
  packageType: {
    type: String,
    enum: ['Silver', 'Gold', 'Platinum','NA'],
  },
  servicesRequested: {
    type: [String],
    enum: ['Social Media Management', 'Website Development', 'Branding', 'Performance Marketing', 'Lead Generation', 'SEO', 'ProductCreation', 'Graphics Design', 'Ecommerce Listing','Quick Commerce'],
  },
  socialMediaManagementRequirement: {
    type: [String],
    enum: ['Instagram', 'WhatsApp', 'Youtube', 'Pinterest', 'Linkedin', 'Other','Facebook'],
  },
  websiteDevelopmentRequirement: {
    type: String,
    enum: ['React', 'Wordpress', 'Other', ''],
  },
  brandingRequirement: {
    type: [String],
    enum: ['Logo Creation', 'Brand Positioning', 'Tagline and Slogan', 'Packing and Graphics', 'Other'],
  },
  ecommerceListingPlatforms: {
    type: [String],
    default: undefined
  },
  quickCommercePlatforms: {
    type: [String],
    default: undefined
  },
  quotationFile: {
    type: String, // This will store the URL or path to the uploaded file
  },

  // Payment Details
  totalServiceFeesCharged: {
    type: Number,
    required: true,
  },
  gstBill: {
    type: String,
    enum: ['Yes', 'No'],
  },
  amountWithoutGST: {
    type: Number,
  },
  paymentDate: {
    type: Date,
  },
  paymentDone: {
    type: String,
    enum: ['Full In Advance', 'Partial Payment', 'Not Done'],
    required: true,
  },
  actualAmountReceived: {
    type: Number,
  },
  pendingAmount: {
    type: Number,
  },
  pendingAmountDueDate: {
    type: Date,
  },
  paymentMode: {
    type: String,
    enum: ['Cash', 'CreditCard', 'Debit Card', 'UPI', 'NEFT', 'RTGS', 'IMPS',''],
  },
  paymentProof: {
    type: String, // This will store the URL or path to the uploaded file
  },

  // Deadline Information
  tentativeDeadlineByCustomer: {
    type: Date,
  },
  websiteDevelopmentTime: {
    type: Number,
  },
  brandingTime: {
    type: Number,
  },
  socialMediaTime: {
    type: Number,
  },

  // Final Details
  servicePromisedByBDA: {
    type: String,
    required: true,
  },
  extraServiceRequested: {
    type: String,
  },
  importantInformation: {
    type: String,
  },
}, {
  timestamps: true,
});

const validEcommercePlatforms = ['Amazon', 'Flipkart', 'Meesho', 'Jiomart', 'Other'];
const validQuickCommercePlatforms = ['Swiggy', 'Zomato', 'Dunzo', 'Other'];

// Custom validator function
function validatePlatforms(platforms, validPlatforms) {
  if (!platforms || platforms.length === 0) return true;
  return platforms.every(platform => validPlatforms.includes(platform));
}

// Pre-save hook for validation
leadSchema.pre('validate', function(next) {
  if (this.ecommerceListingPlatforms && this.ecommerceListingPlatforms.length === 0) {
    this.ecommerceListingPlatforms = undefined;
  }
  if (this.quickCommercePlatforms && this.quickCommercePlatforms.length === 0) {
    this.quickCommercePlatforms = undefined;
  }
  next();
});

leadSchema.pre('save', function(next) {
  if (this.ecommerceListingPlatforms && !this.ecommerceListingPlatforms.every(platform => validEcommercePlatforms.includes(platform))) {
    return next(new Error('ecommerceListingPlatforms contains invalid platforms'));
  }
  if (this.quickCommercePlatforms && !this.quickCommercePlatforms.every(platform => validQuickCommercePlatforms.includes(platform))) {
    return next(new Error('quickCommercePlatforms contains invalid platforms'));
  }
  next();
});

const Lead = mongoose.model('Lead', leadSchema);

module.exports = Lead;