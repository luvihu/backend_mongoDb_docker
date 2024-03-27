import mongoose from 'mongoose';

const bookSchema = new mongoose.Schema(
  {
      title: String,
      author: String,
      genre: String,
      publication_date: String,
  }
);

const Book = mongoose.model('Book', bookSchema);
export default Book;