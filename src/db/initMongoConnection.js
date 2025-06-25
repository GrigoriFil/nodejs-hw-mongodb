import mongoose from 'mongoose';

export const initMongoConnection = async () => {
  console.log('--- DEBUG INFO ---');
  console.log('MONGODB_USER:', process.env.MONGODB_USER);
  console.log('MONGODB_PASSWORD:', process.env.MONGODB_PASSWORD);
  console.log('MONGODB_URL:', process.env.MONGODB_URL);
  console.log('MONGODB_DB:', process.env.MONGODB_DB);
  console.log('--- END DEBUG INFO ---');

  const { MONGODB_USER, MONGODB_PASSWORD, MONGODB_URL, MONGODB_DB } =
    process.env;
  const connectionString = `mongodb+srv://<span class="math-inline">\{MONGODB\_USER\}\:</span>{MONGODB_PASSWORD}@<span class="math-inline">\{MONGODB\_URL\}/</span>{MONGODB_DB}?retryWrites=true&w=majority`;

  try {
    await mongoose.connect(connectionString);
    console.log('Mongo connection successfully established!');
  } catch (error) {
    console.error('Failed to connect to MongoDB', error);
    process.exit(1);
  }
};