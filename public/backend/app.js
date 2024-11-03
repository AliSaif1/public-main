import dotenv from 'dotenv';
dotenv.config();

import cors from 'cors';

import express from 'express';
// import path from 'path';
// import { fileURLToPath } from 'url';
import './config/mongodb.js';
import authRoutes from './routes/auth.js';
import userRoutes from './routes/user.js';
import { storage } from './config/firebase.js';
import { ref, listAll } from 'firebase/storage';
import influencerRoutes from './routes/influencerRoutes.js';
import blogs from './routes/blog.js';
import campaign from './routes/campaign.js';
// import { updateInstagramPostData } from './controllers/extracter.js';

// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

const app = express();
// eslint-disable-next-line no-undef
const PORT = process.env.PORT || 3000;

app.use(cors({
    origin: 'http://localhost:5173', // Allow requests from your frontend
    credentials: true // If you need to allow cookies or other credentials
}));

app.use(express.json());
app.use('/auth', authRoutes);
app.use('/user', userRoutes);
app.use('/api', influencerRoutes);
app.use('/influencer', blogs);
app.use('/Brand', blogs);
app.use('/Brand', campaign);

const checkFirebaseConnection = async () => {
  try {
    const storageRef = ref(storage);
    await listAll(storageRef);
    console.log('Connected to Firebase Storage');
  } catch (error) {
    console.error('Error connecting to Firebase Storage:', error);
  }
};

// app.use(express.static(path.join(__dirname, '../dist')));

// app.get('*', (req, res) => {
//   res.sendFile(path.join(__dirname, '../dist/index.html'));
// });

app.listen(PORT, async () => {
  console.log(`Server is running on port ${PORT}`);
  checkFirebaseConnection(); 

  // console.log("Testing Instagram post data update...");
  //   try {
  //     await updateInstagramPostData();
  //   } catch (error) {
  //     console.error('Manual test failed: ', error.message);
  //   }
});
