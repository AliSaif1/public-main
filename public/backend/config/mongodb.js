import mongoose from 'mongoose';

const mongoUri = 'mongodb+srv://alisaif2617:Ali11297@fyp.you7dai.mongodb.net/influencerHarbor?retryWrites=true&w=majority&appName=fyp';

mongoose.connect(mongoUri)
  .then(() => console.log('Connected to MongoDB Atlas'))
  .catch((error) => console.error('Error connecting to MongoDB:', error));