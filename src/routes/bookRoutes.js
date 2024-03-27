import express from 'express';
import Book from '../models/bookModels.js';
 const router = express.Router()

 //MIDDLEWARE
const getBook = async (req, res, next) => {
  let book;
  const { id } = req.params;

  if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(404).json(
          {
              message: 'El ID del libro no es válido'
          }
      )
  }

  try {
      book = await Book.findById(id);
      if (!book) {
          return res.status(404).json(
              {
                  message: 'El libro no fue encontrado'
              }
          )
      }
     
  } catch (error) {
      return res.status(500).json(
          {
              message: error.message
          }
      )
  }

  res.book = book;
  next()
}

// Obtener todos los libros [GET ALL]
router.get('/', async (req, res) => {
  try {
      const books = await Book.find();
      if (books.length === 0) {
          return res.status(204).json([])
      }
      res.json(books)
  } catch (error) {
      res.status(500).json({ message: error.message })
  }
})

// Crear un nuevo libro (recurso) [POST]
router.post('/', async (req, res) => {
  const { title, author, genre, publication_date } = req.body
  
  try {

  if (!title || !author || !genre || !publication_date) {
      return res.status(400).json({
          message: 'Los campos título, autor, género y fecha son obligatorios'
      })
  }
  const existBook = await Book.findOne({ title })
  if (existBook){
    return res.status(400).json({
      message: 'El libro con ese título ya existe'
    })
  }

  const book = new Book(
      {
          title,
          author,
          genre,
          publication_date
      }
  )

 
      const newBook = await book.save()
      res.status(201).json(newBook)
  } catch (error) {
      res.status(400).json({
          message: error.message
      })
  }

})

router.get('/:id', getBook, async (req, res) => {
  res.json(res.book);
})

router.put('/:id', getBook, async (req, res) => {
  const { title, author, genre, publication_date } = req.body;
  try {
      const book = res.book
      book.title = title || book.title;
      book.author = author || book.author;
      book.genre = genre || book.genre;
      book.publication_date = publication_date || book.publication_date;

      const updatedBook = await book.save()
      res.json(updatedBook)
  } catch (error) {
      res.status(400).json({
          message: error.message
      })
  }
})

router.patch('/:id', getBook, async (req, res) => {
  const { title, author, genre, publication_date } = req.body;

  if (!title && !author && !genre && !publication_date) {
      res.status(400).json({
          message: 'Al menos uno de estos campos debe ser enviado: Título, Autor, Género o fecha de publicación'
      })

  }

  try {
      const book = res.book
      book.title = title || book.title;
      book.author = author || book.author;
      book.genre = genre || book.genre;
      book.publication_date = publication_date || book.publication_date;

      const updatedBook = await book.save()
      res.json(updatedBook)
  } catch (error) {
      res.status(400).json({
          message: error.message
      })
  }
})

router.delete('/:id', getBook, async (req, res) => {
  try {
      const book = res.book
      await book.deleteOne({
          _id: book._id
      });
      res.json({
          message: `El libro ${book.title} fue eliminado correctamente`
      })
  } catch (error) {
      res.status(500).json({
          message: error.message
      })
  }
})

export default router