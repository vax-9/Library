const _ = require("lodash");

const input = document.getElementById("default-search");
const searchButton = document.getElementById("search-button");
const searchResult = document.getElementById("search-result");
let books = [];

async function caricaLibri() {
  while (searchResult.firstChild) {
    searchResult.removeChild(searchResult.firstChild);
  }
  await fetch(
    `https://openlibrary.org/subjects/${input.value.toLowerCase()}.json?`,
  )
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
    });
}

async function findDescription(book) {
  await fetch(`https://openlibrary.org${book.key}.json`)
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

async function createCard(book) {
  await findDescription(book);
  const card = document.createElement("div");
  card.className = ` m-4 grid grid-cols-2 cursor-pointer items-center rounded-lg border border-gray-200 bg-white shadow hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700 md:max-w-xl sm:text-sm`;
  const img = document.createElement("img");
  img.className = `h-48 w-32 rounded-t-lg object-cover md:h-auto md:w-48 md:rounded-none md:rounded-s-lg `;
  img.src = `https://covers.openlibrary.org/b/id/${book.coverId}-M.jpg`;
  img.alt = `${book.title}`;
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
    "col-span-2 break-words text-wrap text-justify hidden transition-all text-xs p-2 text-balance";
  const descriptionText = document.createElement("p");
  descriptionText.className = "text-balance";
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
      description.classList.remove("scale-x-0");
    } else {
      description.classList.add("hidden");
      description.classList.add("scale-x-0");
    }
  });
}

searchButton.addEventListener("click", async (e) => {
  e.preventDefault();
  console.log("Clicked searchButton");

  try {
    await caricaLibri();
    console.log("caricaLibri completed");

    // Verifica se books contiene dati
    console.log("books:", books);
    console.log("createCards called");
    books.forEach((book) => {
      createCard(book);
    });
  } catch (error) {
    console.error("Error:", error);
  }
});
