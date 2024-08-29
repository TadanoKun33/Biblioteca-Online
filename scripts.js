document.querySelectorAll('.read-button').forEach(button => {
    button.addEventListener('click', () => {
        const bookUrl = button.getAttribute('data-book');
        window.location.href = bookUrl;
    });
});


const API_KEY = 'SUA_CHAVE_DE_API_GOOGLE_BOOKS';
const books = [
    { cover: 'livro1.jpg', title: 'Nome do Livro 1', author: 'Autor do Livro 1', pdf: 'livro1.pdf' },
    { cover: 'livro2.jpg', title: 'Nome do Livro 2', author: 'Autor do Livro 2', pdf: 'livro2.pdf' }
];

const uploadButton = document.getElementById('upload-button');
const featuredBooksSection = document.getElementById('featured-books');

const isOwner = true; // Definir se o usuário é o dono da página

if (isOwner) {
    uploadButton.style.display = 'block'; // Mostrar botão de upload
    uploadButton.addEventListener('click', () => {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'application/pdf'; // Aceitar arquivos PDF
        input.addEventListener('change', (event) => {
            const file = event.target.files[0];
            const reader = new FileReader();
            reader.onload = function(e) {
                const newBook = {
                    cover: 'livro3.jpg', // Capa padrão para arquivos PDF
                    title: file.name.replace('.pdf', ''), // Nome do arquivo como título
                    author: 'Autor Desconhecido', // Autor padrão para arquivos PDF
                    pdf: URL.createObjectURL(file) // URL do PDF para leitura
                };
                getBookInfo(newBook);
            };
            reader.readAsDataURL(file);
        });
        input.click();
    });
}

async function getBookInfo(book) {
    const response = await fetch(`https://www.googleapis.com/books/v1/volumes?q=${book.title}&key=${API_KEY}`);
    const data = await response.json();
    if (data.totalItems > 0) {
        const item = data.items[0].volumeInfo;
        book.title = item.title || book.title;
        book.author = item.authors ? item.authors[0] : 'Autor Desconhecido';
        book.cover = item.imageLinks ? item.imageLinks.thumbnail : 'livro3.jpg'; // Capa padrão se não houver
    }
    books.push(book); // Adicionar novo livro à lista
    console.log('Livro enviado com sucesso:', book);
    displayBooks();
}

function displayBooks() {
    featuredBooksSection.innerHTML = ''; // Limpar conteúdo atual

    books.forEach((book, index) => {
        const bookCard = document.createElement('div');
        bookCard.classList.add('book-card');

        const bookImage = document.createElement('img');
        bookImage.src = book.cover;
        bookImage.alt = book.title;

        const bookTitle = document.createElement('h3');
        bookTitle.textContent = book.title;

        const bookAuthor = document.createElement('p');
        bookAuthor.textContent = `Autor: ${book.author}`;

        const readButton = document.createElement('button');
        readButton.textContent = 'Ler';
        readButton.dataset.book = book.pdf;
        readButton.classList.add('read-button');
        readButton.addEventListener('click', () => {
            window.open(book.pdf, '_blank'); // Abrir PDF em nova aba
        });

        bookCard.appendChild(bookImage);
        bookCard.appendChild(bookTitle);
        bookCard.appendChild(bookAuthor);
        bookCard.appendChild(readButton);

        featuredBooksSection.appendChild(bookCard);
    });
}

// Exibir os livros na página ao carregar
displayBooks();
