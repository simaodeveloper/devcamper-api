import './utils/envSetup';
import fs from 'fs';
import mongoose from 'mongoose';
import colors from 'colors';

// Load models
import Bootcamp from './models/Bootcamp';
import Course from './models/Course';

// Connect to DB
mongoose.connect(process.env.DB_URI, {
  useCreateIndex: true,
  useNewUrlParser: true,
  useUnifiedTopology: true
});

// Read JSON Files
const bootcamps = JSON.parse(
  fs.readFileSync(`${process.cwd()}/_data/bootcamps.json`, 'utf-8')
);

const courses = JSON.parse(
  fs.readFileSync(`${process.cwd()}/_data/courses.json`, 'utf-8')
);

// Import into DB
const importData = async () => {
  try {
    await Bootcamp.create(bootcamps);
    await Course.create(courses);
    console.log('Data Imported...'.green.inverse);
    process.exit();
  } catch (error) {
    console.error(error);
  }
};

// Delete data
const deleteData = async () => {
  try {
    await Bootcamp.deleteMany();
    await Course.deleteMany();
    console.log('Data Destroyed...'.red.inverse);
    process.exit();
  } catch (error) {
    console.error(error);
  }
};

if (process.argv[2] === '-i') {
  importData();
} else if (process.argv[2] === '-d') {
  deleteData();
}
