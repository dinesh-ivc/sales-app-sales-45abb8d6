import mongoose from 'mongoose';

const websiteVisitSchema = new mongoose.Schema({
  date: {
    type: Date,
    required: true
  },
  visitorCount: {
    type: Number,
    required: true,
    min: 0
  },
  pageViews: {
    type: Number,
    required: true,
    min: 0
  },
  bounceRate: {
    type: Number,
    required: true,
    min: 0,
    max: 100
  },
  averageSessionDuration: {
    type: Number,
    required: true,
    min: 0
  },
  trafficSource: {
    type: String,
    required: true,
    enum: ['Organic Search', 'Direct', 'Social Media', 'Email', 'Referral', 'Paid Advertising']
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

websiteVisitSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

export default mongoose.models.WebsiteVisit || mongoose.model('WebsiteVisit', websiteVisitSchema);