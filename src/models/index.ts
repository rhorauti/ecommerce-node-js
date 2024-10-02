import mongoose from 'mongoose';

const mongodb = mongoose
  .connect('mongodb+srv://rhorauti:Rkazuo4474!@cluster.tqjbk.mongodb.net/e-commerce')
  .then((result) => {})
  .catch((error) => console.log(error));

export { mongodb };
