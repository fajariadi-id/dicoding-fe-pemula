const form = document.getElementById("form");
const inputTitle = document.getElementById("title");
const inputWriter = document.getElementById("writer");
const inputYear = document.getElementById("year");
const unfinishedBooksContainer = document.getElementById("unfinished");
const finishedBooksContainer = document.getElementById("finished");
const modalDelete = document.querySelector(".modal-delete");
const modalForm = document.querySelector(".modal-form");
const btnCancel = document.querySelector(".btn-cancel");
const btnComplete = document.querySelector(".btn-complete");
const btnConfirm = document.querySelector(".btn-confirm");
const searchBar = document.querySelector(".search-bar .input");
const alertMessage = document.querySelector(".modal-form p");
const btnSubmit = document.querySelector(".btn-submit");

const savedUnfinishedBooks = JSON.parse(
  localStorage?.getItem("unfinishedBooks")
);
const savedFinishedBooks = JSON.parse(localStorage.getItem("finishedBooks"));

let unfinishedBooks = savedUnfinishedBooks ? savedUnfinishedBooks : [];
let finishedBooks = savedFinishedBooks ? savedFinishedBooks : [];

let edit = false;
let editedData = { id: 0, isComplete: false };

btnCancel.addEventListener("click", () => modalDelete.close());
btnComplete.addEventListener("click", () => modalForm.close());

inputYear.addEventListener("keypress", (e) => {
  if (!/[0-9Enter]/.test(e.key)) {
    alertMessage.innerText = "hanya bisa masukkan angka aja yaa!";
    modalForm.showModal();
    e.preventDefault();
  }
});

form.addEventListener("submit", (e) => {
  e.preventDefault();

  if (!inputTitle.value || !inputWriter.value || !inputYear.value) {
    alertMessage.innerText = "yah.. data yang kamu masukkan kurang lengkap :(";
    modalForm.showModal();
    return;
  }

  if (!edit) {
    const body = {
      id: +new Date(),
      title: inputTitle.value,
      author: inputWriter.value,
      year: inputYear.value,
      isComplete: false,
    };

    unfinishedBooks.push(body);
    unfinishedBookCard(body);
    console.log("uni", unfinishedBooks);

    localStorage.setItem("unfinishedBooks", JSON.stringify(unfinishedBooks));
  }

  if (edit) {
    if (!editedData.isComplete) {
      const mapEditedData = unfinishedBooks.map((item) =>
        item.id === editedData.id
          ? {
              ...item,
              title: inputTitle.value,
              author: inputWriter.value,
              year: inputYear.value,
            }
          : item
      );

      unfinishedBooks = mapEditedData;
      unfinishedBooksContainer.innerHTML = "";
      unfinishedBooks.forEach((item) => unfinishedBookCard(item));

      localStorage.setItem("unfinishedBooks", JSON.stringify(unfinishedBooks));
    }

    if (editedData.isComplete) {
      const mapEditedData = finishedBooks.map((item) =>
        item.id === editedData.id
          ? {
              ...item,
              title: inputTitle.value,
              author: inputWriter.value,
              year: inputYear.value,
            }
          : item
      );

      finishedBooks = mapEditedData;
      finishedBooksContainer.innerHTML = "";
      finishedBooks.forEach((item) => finishedBookCard(item));

      localStorage.setItem("finishedBooks", JSON.stringify(finishedBooks));
    }

    const cards = document.querySelectorAll("div");
    cards.forEach((card) => {
      if (card.classList.contains("edit")) {
        card.classList.remove("edit");
      }
    });

    edit = false;
    editedData = { id: 0, isComplete: false };
    btnSubmit.innerText = "tambah buku";
  }

  clearForm();
});

const handleSearch = (e) => {
  const search = e.target.value;

  unfinishedBooksContainer.innerHTML = "";
  finishedBooksContainer.innerHTML = "";

  const onSearchUnfinished = unfinishedBooks.filter((item) =>
    item.title.includes(search)
  );
  const onSearchFinished = finishedBooks.filter((item) =>
    item.title.includes(search)
  );

  onSearchUnfinished.forEach((item) => unfinishedBookCard(item));
  onSearchFinished.forEach((item) => finishedBookCard(item));
};

searchBar.addEventListener("change", handleSearch);

const unfinishedBookCard = (book) => {
  const { title, author, year, isComplete, id } = book;

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

  const switchBtn = bookEl.querySelector(".actions .fa-right-from-bracket");
  const deleteBtn = bookEl.querySelector(".actions .fa-trash-can");
  const editBtn = bookEl.querySelector(".actions .fa-pencil");

  deleteBtn.addEventListener("click", () => {
    modalDelete.showModal();

    btnConfirm.addEventListener("click", () => {
      deleteUnfinishedBook(bookEl, id);
      modalDelete.close();
    });
  });

  switchBtn.addEventListener("click", () => {
    unfinishedBooks
      .map((item) =>
        item.id === id ? { ...item, isComplete: !item.isComplete } : item
      )
      .filter((item) => {
        if (item.isComplete) {
          finishedBooks.push(item);
          finishedBookCard(item);
        }
      });

    deleteUnfinishedBook(bookEl, id);

    localStorage.setItem("unfinishedBooks", JSON.stringify(unfinishedBooks));
    localStorage.setItem("finishedBooks", JSON.stringify(finishedBooks));
  });

  editBtn.addEventListener("click", () => {
    if (edit) {
      alertMessage.innerText = "tolong simpan dulu yaa perubahaannya ;)";
      modalForm.showModal();
      return;
    }

    edit = true;
    btnSubmit.innerText = "edit buku";
    bookEl.classList.add("edit");
    editedData = { id, isComplete };

    inputTitle.value = title;
    inputWriter.value = author;
    inputYear.value = year;

    inputTitle.focus();
  });

  unfinishedBooksContainer.appendChild(bookEl);
};

const finishedBookCard = (book) => {
  const { title, author, year, isComplete, id } = book;

  const bookEl = document.createElement("div");
  bookEl.classList.add("card");
  bookEl.innerHTML = `
    <div class="book-info">
      <h4>${title}</h4>
      <p>Penulis: ${author}</p>
      <p>Tahun: ${year}</p>
    </div>

    <div class="actions">
      <i class="fa-solid fa-right-from-bracket complete"></i>
      <div>
        <i class="fa-solid fa-pencil"></i>
        <i class="fa-solid fa-trash-can"></i>
      </div>
    </div>
    `;

  const switchBtn = bookEl.querySelector(".actions .fa-right-from-bracket");
  const deleteBtn = bookEl.querySelector(".actions .fa-trash-can");
  const editBtn = bookEl.querySelector(".actions .fa-pencil");

  deleteBtn.addEventListener("click", () => {
    modalDelete.showModal();

    btnConfirm.addEventListener("click", () => {
      deleteFinishedBook(bookEl, id);
      modalDelete.close();
    });
  });

  switchBtn.addEventListener("click", () => {
    finishedBooks
      .map((item) =>
        item.id === id ? { ...item, isComplete: !item.isComplete } : item
      )
      .filter((item) => {
        if (!item.isComplete) {
          unfinishedBooks.push(item);
          unfinishedBookCard(item);
        }
      });

    deleteFinishedBook(bookEl, id);

    localStorage.setItem("finishedBooks", JSON.stringify(finishedBooks));
    localStorage.setItem("unfinishedBooks", JSON.stringify(unfinishedBooks));
  });

  editBtn.addEventListener("click", () => {
    if (edit) {
      alertMessage.innerText = "tolong simpan dulu yaa perubahaannya ;)";
      modalForm.showModal();
      return;
    }

    edit = true;
    btnSubmit.innerText = "edit buku";
    bookEl.classList.add("edit");
    editedData = { id, isComplete };

    inputTitle.value = title;
    inputWriter.value = author;
    inputYear.value = year;

    inputTitle.focus();
  });

  finishedBooksContainer.appendChild(bookEl);
};

const clearForm = () => {
  inputTitle.value = "";
  inputWriter.value = "";
  inputYear.value = "";

  inputTitle.blur();
  inputWriter.blur();
  inputYear.blur();
};

const deleteUnfinishedBook = (bookEl, id) => {
  bookEl.remove();

  const filtered = unfinishedBooks
    .map((item) =>
      item.id === id ? { ...item, isComplete: !item.isComplete } : item
    )
    .filter((item) => !item.isComplete);

  unfinishedBooks = filtered;

  localStorage.setItem("unfinishedBooks", JSON.stringify(unfinishedBooks));
};

const deleteFinishedBook = (bookEl, id) => {
  bookEl.remove();

  const filtered = finishedBooks
    .map((item) =>
      item.id === id ? { ...item, isComplete: !item.isComplete } : item
    )
    .filter((item) => item.isComplete);

  finishedBooks = filtered;

  localStorage.setItem("finishedBooks", JSON.stringify(finishedBooks));
};

if (savedUnfinishedBooks)
  unfinishedBooks.forEach((item) => unfinishedBookCard(item));
if (savedFinishedBooks) finishedBooks.forEach((item) => finishedBookCard(item));
