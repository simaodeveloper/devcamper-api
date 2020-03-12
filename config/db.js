import mongoose from 'mongoose';

export default async () => {
  const db = await mongoose.connect(process.env.MONGO_URI, {
    useCreateIndex: true,
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false
  });

  console.log(`MongoDB Connected: ${db.connection.host}`.cyan.underline.bold);
}
