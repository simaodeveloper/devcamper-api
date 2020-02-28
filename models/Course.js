import mongoose from 'mongoose';

const MODEL_NAME = 'Course';

const CourseSchema = new mongoose.Schema({
  title: {
    type: String,
    trim: true,
    unique: true,
    required: [true, 'Please add a course title']
  },
  description: {
    type: String,
    required: [true, 'Please add a description']
  },
  weeks: {
    type: String,
    required: [true, 'Please add number of weeks']
  },
  tuition: {
    type: Number,
    required: [true, 'Please add a tuition cost']
  },
  minimumSkill: {
    type: String,
    required: [true, 'Please add a minimum skill'],
    enum: ['beginner', 'intermediate', 'advanced']
  },
  scholarshipAvailable: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  bootcamp: {
    type: mongoose.Schema.ObjectId,
    ref: 'Bootcamp',
    required: true
  }
});

CourseSchema.statics.getAverageCost = async function (bootcampId) {
  const aggregate = await this.aggregate([
    {
      $match: {
        bootcamp: bootcampId
      }
    },
    {
      $group: {
        _id: '$bootcamp',
        averageCost: { $avg: '$tuition' }
      }
    }
  ]);

  try {
    await this.model('Bootcamp').findByIdAndUpdate(bootcampId, {
      averageCost: Math.ceil(aggregate[0].averageCost * 10) / 10
    })
  } catch (err) {
    console.error(err);
  }
};

// Execute getAverageCost after save
CourseSchema.post('save', function (doc, next) {
  this.constructor.getAverageCost(this.bootcamp);
  next();
})

// Execute getAverageCost before remove
CourseSchema.pre('remove', function (next) {
  this.constructor.getAverageCost(this.bootcamp);
  next();
})

export default mongoose.model(MODEL_NAME, CourseSchema);