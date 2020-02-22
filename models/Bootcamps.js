import mongoose from 'mongoose';
import slugify from 'slugify';

import geocoder from '../utils/geocoder';

const MODEL_NAME = 'Bootcamp';

const BootcampSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add a name'],
    unique: true,
    trim: true,
    maxLength: [50, "name can't not be more than 50 characters"]
  },
  slug: String,
  description: {
    type: String,
    required: [true, 'Please add a description'],
    maxLength: [500, "name can't not be more than 50 characters"]
  },
  website: {
    type: String,
    match: [
      /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/,
      'Please use a valid URL with HTTP or HTTPS'
    ]
  },
  phone: {
    type: String,
    maxLength: [20, 'Phone number can not be linger than 20 characters']
  },
  email: {
    type: String,
    match: [
      /^\w+([.-]?\w+)*@\w+\1*(\.\w{2,3})+$/,
      'Please add a valid email'
    ]
  },
  address: {
    type: String,
    required: [true, 'Please add an address']
  },
  location: {
    type: {
      type: String,
      enum: ['Point'],
    },
    coordinates: {
      type: [Number],
      index: '2dsphere'
    },
    formattedAddress: String,
    street: String,
    city: String,
    state: String,
    zipcode: String,
    country: String
  },
  careers: {
    type: [String],
    required: true,
    enum: [
      'Web Development',
      'Mobile Development',
      'UI/UX',
      'Data Science',
      'Business',
      'Other'
    ]
  },
  averageRating: {
    type: Number,
    min: [1, 'Rating must be at least 1'],
    max: [10, 'Rating must can not be more than 10']
  },
  averageCost: Number,
  photo: {
    type: String,
    default: 'no-photo.jpg'
  },
  housing: {
    type: Boolean,
    default: false
  },
  jobAssistance: {
    type: Boolean,
    default: false
  },
  jobGuarantee: {
    type: Boolean,
    default: false
  },
  acceptGi: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Middleware to set slug
BootcampSchema.pre('save', function (next) {
  this.slug = slugify(this.name, { lower: true })
  next();
});

BootcampSchema.pre('save', async function (next) {
  const location = await geocoder.geocode(this.address);

  const {
    longitude,
    latitude,
    formattedAddress,
    city,
    zipcode,
    streetName: street,
    stateCode: state,
    countryCode: country
  } = location[0];

  this.location = {
    street,
    city,
    state,
    country,
    zipcode,
    formattedAddress,
    type: 'Point',
    coordinates: [
      longitude,
      latitude
    ],
  };

  // Do not save address in DB
  this.address = undefined;

  next();
});

// Geocode & create location field

export default mongoose.model(MODEL_NAME, BootcampSchema)
