import mongoose from 'mongoose';

export const initMongoConnection = async () => {
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