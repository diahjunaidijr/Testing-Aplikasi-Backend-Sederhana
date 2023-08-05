# Testing-Aplikasi-Backend-Sederhana
- Kriteria 1 : Aplikasi menggunakan port 9000
- Kriteria 2 : Aplikasi dijalankan dengan perintah npm run start
- Kriteria 3 : API dapat menyimpan buku
- Kriteria 4 : API dapat menampilkan seluruh buku
- Kriteria 5 : API dapat menampilkan detail buku
- Kriteria 6 : API dapat mengubah data buku
- Kriteria 7 : API dapat menghapus buku

Opsional [Menggunakan POSTMAN untuk API Testing]:

1. Tambahkan fitur query parameters pada route GET /books (Mendapatkan seluruh buku).
-name : Tampilkan seluruh buku yang mengandung nama berdasarkan nilai yang diberikan pada query ini. Contoh /books?name=”dicoding”, maka akan menampilkan daftar buku yang mengandung nama “dicoding” secara non-case sensitive  (tidak peduli besar dan kecil huruf).
-reading : Bernilai 0 atau 1. Bila 0, maka tampilkan buku yang sedang tidak dibaca (reading: false). Bila 1, maka tampilkan buku yang sedang dibaca (reading: true). Selain itu, tampilkan buku baik sedang dibaca atau tidak.
-finished : Bernilai 0 atau 1. Bila 0, maka tampilkan buku yang sudah belum selesai dibaca (finished: false). Bila 1, maka tampilkan buku yang sudah selesai dibaca (finished: true). Selain itu, tampilkan buku baik yang sudah selesai atau belum dibaca.

2. Menggunakan ESLint dan salah satu style guide agar gaya penulisan kode JavaScript lebih konsisten. Serta ketika dijalankan perintah npx eslint . tidak terdapat error yang muncul.
