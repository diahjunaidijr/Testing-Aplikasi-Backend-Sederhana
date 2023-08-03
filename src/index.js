// Import required modules
import express, { json } from 'express';
import { nanoid } from 'nanoid';
 
const app = express();
const port = 9000;
 
// Middleware untuk mengizinkan JSON body pada request
app.use(express.json());
 
 
// Data buku (sementara)
const books = [];
 
// 3. API dapat menyimpan buku
app.post('/books', (req, res) => {
  const {
    name, year, author, summary, publisher, pageCount, readPage, reading,
  } = req.body;
 
  // Memeriksa apakah client melampirkan properti name pada request body
  if (!name) {
    return res.status(400).json({
      status: 'fail',
      message: 'Gagal menambahkan buku. Mohon isi nama buku',
    });
  }
 
  // Memeriksa apakah nilai properti readPage lebih besar dari nilai properti pageCount
  if (readPage > pageCount) {
    return res.status(400).json({
      status: 'fail',
      message: 'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount',
    });
  }
 
  const id = nanoid(16);
  const finished = pageCount === readPage;
  const insertedAt = new Date().toISOString();
  const updatedAt = insertedAt;
 
  const newBook = {
    id,
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    finished,
    reading,
    insertedAt,
    updatedAt,
  };
 
  books.push(newBook); // Add the new book to the 'books' array
 
  res.status(201).json({
    status: 'success',
    message: 'Buku berhasil ditambahkan',
    data: {
      bookId: id,
    },
  });
});
 
// 4. API dapat menampilkan seluruh buku
// app.get('/books', (req, res) => {
//   const { name, reading, finished } = req.query;
//   let filteredBooks = books;
 
//   if (name) {
//     // Case-insensitive search for books that contain the given name
//     const lowerCaseName = name.toLowerCase();
//     filteredBooks = books.filter((book) => book.name.toLowerCase().includes(lowerCaseName));
//   };
  
//   // Filter books based on the 'reading' query parameter
//   if (reading !== undefined) {
//     const isReading = reading === '1'; // Convert string to boolean
//     filteredBooks = filteredBooks.filter((book) => book.reading === isReading);
//   }
 
//   // Filter books based on the 'finished' query parameter
//   if (finished !== undefined) {
//     const isFinished = finished === '1'; // Convert string to boolean
//     filteredBooks = filteredBooks.filter((book) => book.finished === isFinished);
//   }
 
//   if (books.length === 0) {
//     return res.status(200).json({
//       status: 'success',
//       data: {
//         books: [],
//       },
//     });
//   }
//   // If there are books, return them with the specified response format
//   const bookList = books.map(({ id, name, publisher }) => ({
//     id,
//     name,
//     publisher,
//   }));
 
//   res.status(200).json({
//     status: 'success',
//     data: {
//       books: bookList,
//     },
//   });
 
//   if (name) {
//     const searchKeyword = name.toLowerCase();
//     filteredBooks = filteredBooks.filter((book) => book.name.toLowerCase().includes(searchKeyword));
//   }
 
//   if (reading === '0') {
//     filteredBooks = filteredBooks.filter((book) => book.reading === false);
//   } else if (reading === '1') {
//     filteredBooks = filteredBooks.filter((book) => book.reading === true);
//   }
 
//   if (finished === '0') {
//     filteredBooks = filteredBooks.filter((book) => book.finished === false);
//   } else if (finished === '1') {
//     filteredBooks = filteredBooks.filter((book) => book.finished === true);
//   }
 
//   res.status(200).json({
//     status: 'success',
//     data: {
//       books: filteredBooks.map(({ id, name, publisher }) => ({ id, name, publisher })),
//     },
//   });
// });
// app.get('/books', (req, res) => {
//   const { name } = req.query;
 
//   // If the name query parameter is provided, filter the books by name
//   let filteredBooks = [];
//   if (name) {
//     const searchKeyword = name.toLowerCase();
//     filteredBooks = books.filter((book) => book.name.toLowerCase().includes(searchKeyword));
//   }
 
//   // Return the names of the filtered books or an empty array if no books match the filter
//   const bookNames = filteredBooks.map((book) => book.name);
//   res.status(200).json({
//     status: 'success',
//     data: {
//       books: bookNames,
//     },
//   });
// });
app.get('/books', (req, res) => {
  // Check if there are any books in the 'books' array
  const { name } = req.query;
 
  // Filter books based on the 'name' query parameter (case-insensitive)
  let filteredBooks = [...books];
  if (name) {
    const searchKeyword = name.toLowerCase();
    filteredBooks = filteredBooks.filter((books) => books.name.toLowerCase().includes(searchKeyword));
  }
 
  // Prepare the response
  res.status(200).json({
    status: 'success',
    data: {
      books: filteredBooks.map(({ id, name, publisher }) => ({ id, name, publisher })),
    },
  });
});
 
// 5. API dapat menampilkan detail buku
app.get('/books/:bookId', (req, res) => {
  const { bookId } = req.params;
  const book = books.find((book) => book.id === bookId);
 
  if (!book) {
    return res.status(404).json({
      status: 'fail',
      message: 'Buku tidak ditemukan',
    });
  }
 
  res.status(200).json({
    status: 'success',
    data: {
      book,
    },
  });
});
 
// 6. API dapat mengubah data buku
app.put('/books/:bookId', (req, res) => {
  const { bookId } = req.params;
 
  const bookIndex = books.findIndex((book) => book.id === bookId);
 
  if (bookIndex === -1) {
    return res.status(404).json({
      status: 'fail',
      message: 'Gagal memperbarui buku. Id tidak ditemukan',
    });
  }
  const updatedBook = {
    id: books[bookIndex].id,
    insertedAt: books[bookIndex].insertedAt,
    ...req.body,
  };
  if (!updatedBook.name) {
    return res.status(400).json({
      status: 'fail',
      message: 'Gagal memperbarui buku. Mohon isi nama buku',
    });
  }
  if (updatedBook.readPage > updatedBook.pageCount) {
    return res.status(400).json({
      status: 'fail',
      message: 'Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount',
    });
  }
  books[bookIndex] = updatedBook;
 
  res.status(200).json({
    status: 'success',
    message: 'Buku berhasil diperbarui',
  });
});
 
// 7. API dapat menghapus buku
app.delete('/books/:bookId', (req, res) => {
  const { bookId } = req.params;
  const bookIndex = books.findIndex((book) => book.id === bookId);
 
  if (bookIndex === -1) {
    return res.status(404).json({
      status: 'fail',
      message: 'Buku gagal dihapus. Id tidak ditemukan',
    });
  }
 
  books.splice(bookIndex, 1);
 
  res.status(200).json({
    status: 'success',
    message: 'Buku berhasil dihapus',
  });
});
 
// Server dijalankan dengan perintah npm run start
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});