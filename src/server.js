import { Server } from '@hapi/hapi';
import { nanoid } from 'nanoid';

const init = async () => {
  const server = new Server({
    port: 9000,
    host: 'localhost',
  });

  // Data buku (sementara)
  const books = [];

  // 3. API dapat menyimpan buku
  server.route({
    method: 'POST',
    path: '/books',
    handler: (request, h) => {
      const {
        name, year, author, summary, publisher, pageCount, readPage, reading,
      } = request.payload;

      // Memeriksa apakah client melampirkan properti name pada request body
      if (!name) {
        return h.response({
          status: 'fail',
          message: 'Gagal menambahkan buku. Mohon isi nama buku',
        }).code(400);
      }

      // Memeriksa apakah nilai properti readPage lebih besar dari nilai properti pageCount
      if (readPage > pageCount) {
        return h.response({
          status: 'fail',
          message: 'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount',
        }).code(400);
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

      return h.response({
        status: 'success',
        message: 'Buku berhasil ditambahkan',
        data: {
          bookId: id,
        },
      }).code(201);
    },
  });

  // 4. API dapat menampilkan seluruh buku
  server.route({
    method: 'GET',
    path: '/books',
    handler: (request, h) => {
      const { name } = request.query;

      // Filter books based on the 'name' query parameter (case-insensitive)
      let filteredBooks = [...books];
      if (name) {
        const searchKeyword = name.toLowerCase();
        filteredBooks = filteredBooks.filter((book) => book.name.toLowerCase().includes(searchKeyword));
      }

      // Prepare the response
      return h.response({
        status: 'success',
        data: {
          books: filteredBooks.map(({ id, name, publisher }) => ({ id, name, publisher })),
        },
      }).code(200);
    },
  });

  // 5. API dapat menampilkan detail buku
  server.route({
    method: 'GET',
    path: '/books/{bookId}',
    handler: (request, h) => {
      const { bookId } = request.params;
      const book = books.find((book) => book.id === bookId);

      if (!book) {
        return h.response({
          status: 'fail',
          message: 'Buku tidak ditemukan',
        }).code(404);
      }

      return h.response({
        status: 'success',
        data: {
          book,
        },
      }).code(200);
    },
  });

  // 6. API dapat mengubah data buku
  server.route({
    method: 'PUT',
    path: '/books/{bookId}',
    handler: (request, h) => {
      const { bookId } = request.params;

      const bookIndex = books.findIndex((book) => book.id === bookId);

      if (bookIndex === -1) {
        return h.response({
          status: 'fail',
          message: 'Gagal memperbarui buku. Id tidak ditemukan',
        }).code(404);
      }
      
      const updatedBook = {
        id: books[bookIndex].id,
        insertedAt: books[bookIndex].insertedAt,
        ...request.payload,
      };
      
      if (!updatedBook.name) {
        return h.response({
          status: 'fail',
          message: 'Gagal memperbarui buku. Mohon isi nama buku',
        }).code(400);
      }
      
      if (updatedBook.readPage > updatedBook.pageCount) {
        return h.response({
          status: 'fail',
          message: 'Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount',
        }).code(400);
      }
      
      books[bookIndex] = updatedBook;
      
      return h.response({
        status: 'success',
        message: 'Buku berhasil diperbarui',
      }).code(200);
    },
  });

  // 7. API dapat menghapus buku
  server.route({
    method: 'DELETE',
    path: '/books/{bookId}',
    handler: (request, h) => {
      const { bookId } = request.params;
      const bookIndex = books.findIndex((book) => book.id === bookId);

      if (bookIndex === -1) {
        return h.response({
          status: 'fail',
          message: 'Buku gagal dihapus. Id tidak ditemukan',
        }).code(404);
      }

      books.splice(bookIndex, 1);

      return h.response({
        status: 'success',
        message: 'Buku berhasil dihapus',
      }).code(200);
    },
  });

  await server.start();
  console.log(`Server running at: ${server.info.uri}`);
};

process.on('unhandledRejection', (err) => {
  console.log(err);
  process.exit(1);
});

init();
