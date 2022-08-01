const form = document.getElementById("form");
const inputTitle = document.getElementById("title");
const inputWriter = document.getElementById("writer");
const inputYear = document.getElementById("year");
const unfinishedBooksContainer = document.getElementById("unfinished");

const btnSubmit = document.getElementsByClassName("btn-submit");

inputYear.addEventListener("keypress", (e) => {
  if (!/[0-9Enter]/.test(e.key)) {
    alert("Mohon untuk memasukkan angka.");
    e.preventDefault();
  }
});

let books = [];

form.addEventListener("submit", (e) => {
  e.preventDefault();

  const body = {
    id: +new Date(),
    title: inputTitle.value,
    author: inputWriter.value,
    year: inputYear.value,
    isComplete: false,
  };

  books.push(body);
  unfinishedBookCard(body);
});

const unfinishedBookCard = (book) => {
  const { title, author, year, isComplete } = book;

  const bookEl = document.createElement("div");
  bookEl.classList.add("card");
  bookEl.innerHTML = `
    <div class="book-info">
        <h4>${title}</h4>
        <p>Penulis: ${author}</p>
        <p>Tahun: ${year}</p>
    </div>

    <div class="actions">
        <i class="fa-solid fa-right-from-bracket"></i>
        <div>
            <i class="fa-solid fa-pencil"></i>
            <i class="fa-solid fa-trash-can"></i>
        </div>
    </div>
    `;

  unfinishedBooksContainer.appendChild(bookEl);
};
