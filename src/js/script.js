const _ = require("lodash");

const input = document.getElementById("default-search");
const searchButton = document.getElementById("search-button");
const searchResult = document.getElementById("search-result");
let books = [];

function caricaLibri() {
  while (searchResult.firstChild) {
    searchResult.removeChild(searchResult.firstChild);
  }
  fetch(`https://openlibrary.org/subjects/${input.value}.json?`)
    .then((response) => response.json())
    .then((data) => {
      data.works.forEach((element, i) => {
        let authors = [];
        element.authors.forEach((author) => {
          authors.push(author.name);
        }),
          (books[i] = {
            title: element.title,
            authors: authors,
            year: element.first_publish_year,
            key: element.key,
            coverId: element.cover_id,
          });
      });

      books.forEach((book) => {
        findDescription(book);
        // createCard(book);
      });
    });
}

function createCard(book) {
  const card = document.createElement("div");
  card.className = ` m-4 grid grid-cols-2 cursor-pointer items-center rounded-lg border border-gray-200 bg-white shadow hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700 md:max-w-xl sm:text-sm`;
  const img = document.createElement("img");
  img.className = `h-48 w-32 rounded-t-lg object-cover md:h-auto md:w-48 md:rounded-none md:rounded-s-lg `;
  img.src = `https://covers.openlibrary.org/b/id/${book.coverId}-M.jpg`;
  const textDiv = document.createElement("div");
  textDiv.classList = `flex flex-col justify-between p-3 leading-normal`;
  const title = document.createElement("h3");
  title.textContent = `${book.title}`;
  title.classList = "font-bold text-lg";
  const authors = document.createElement("h4");
  if (book.authors[1]) {
    authors.textContent = `${book.authors.join(", ")}`;
  } else {
    authors.textContent = `${book.authors[0]}`;
  }
  authors.classList = "font-semibold text-base";
  const publishYear = document.createElement("h5");
  publishYear.textContent = `${book.year}`;
  const description = document.createElement("div");
  description.className =
    "w-max-screen flex col-span-2 justify-center item-center hidden transition-all text-xs text-balance p-2 break-normal";
  const descriptionText = document.createElement("p");
  descriptionText.textContent = `${book.description}`;
  searchResult.appendChild(card);
  card.appendChild(img);
  card.appendChild(textDiv);
  textDiv.appendChild(title);
  textDiv.appendChild(authors);
  textDiv.appendChild(publishYear);
  card.appendChild(description);
  description.appendChild(descriptionText);

  card.addEventListener("click", () => {
    if (description.classList.contains("hidden")) {
      description.classList.remove("hidden");
    } else {
      description.classList.add("hidden");
    }
  });
}

function findDescription(book) {
  fetch(`https://openlibrary.org${book.key}.json`)
    .then((response) => response.json())
    .then((data) => {
      if (typeof data.description == "string") {
        book.description = data.description;
      } else if (
        typeof data.description == "object" &&
        data.description !== undefined
      ) {
        book.description = data.description.value;
      } else {
        book.description = "no description found";
      }
    });
}

searchButton.addEventListener("click", (e) => {
  e.preventDefault();
  caricaLibri();
  books.forEach((book) => {
    createCard(book);
  });
});
