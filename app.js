//TMDB API URLS

const APILINK =
  "https://api.themoviedb.org/3/discover/movie?sort_by=popularity.desc&api_key=29b3acb9dd958431968afb44d4b3d126&page=1";
const IMG_PATH = "https://image.tmdb.org/t/p/w1280";
const SEARCHAPI =
  "https://api.themoviedb.org/3/search/movie?&api_key=29b3acb9dd958431968afb44d4b3d126&query=";
const GENREAPIURL = `https://api.themoviedb.org/3/genre/movie/list?api_key=29b3acb9dd958431968afb44d4b3d126&language=en-US`;
const moviesApiUrl = `https://api.themoviedb.org/3/discover/movie?api_key=29b3acb9dd958431968afb44d4b3d126&language=en-US&sort_by=popularity.desc`;
const seriesApiUrl = `https://api.themoviedb.org/3/discover/tv?api_key=29b3acb9dd958431968afb44d4b3d126&language=en-US&sort_by=popularity.desc`;

const main = document.getElementById("section");
const form = document.getElementById("form");
const form2 = document.getElementById("form2");
const search = document.getElementById("query");
const search2 = document.getElementById("query2");
const secondary = document.getElementById("section2");

//fetch genre list

async function fetchGenres() {
  try {
    const response = await fetch(GENREAPIURL);
    const data = await response.json();
    displayGenres(data.genres);
  } catch (error) {
    console.error("Error fetching genres:", error);
  }
}

//display genre list

function displayGenres(genres) {
  const genresContainer = document.getElementById("genres");
  genresContainer.innerHTML = "";

  genres.forEach((genre) => {
    const genreElement = document.createElement("a");
    genreElement.classList.add("genre");
    genreElement.setAttribute("data-genre-id", genre.id);
    genreElement.setAttribute("data-genre-name", genre.name);

    genreElement.innerHTML = `

                ${genre.name}

        `;

    genreElement.addEventListener("click", () => {
      const genreId = genreElement.getAttribute("data-genre-id");
      const genreName = genreElement.getAttribute("data-genre-name");
      localStorage.setItem("selectedGenreId", genreId);
      localStorage.setItem("selectedGenreName", genreName);
      window.location.href = "genres.html";
    });

    genresContainer.appendChild(genreElement);
  });
}

//fetch movies based on genre selection

async function fetchMoviesByGenre(genreId) {
  try {
    const response = await fetch(`${moviesApiUrl}&with_genres=${genreId}`);
    const data = await response.json();
    displayMovies(data.results);
  } catch (error) {
    console.error("Error fetching movies by genre:", error);
  }
}

//fetch movies based on recommended movies

async function fetchRecommendedMovies() {
  try {
    const response = await fetch(`${moviesApiUrl}&sort_by=popularity.desc`);
    const data = await response.json();
    console.log("Recommended Movies Data:", data);
    displayMovies(data.results);
  } catch (error) {
    console.error("Error fetching recommended movies:", error);
  }
}

//fetch movies based on recommended series

async function fetchRecommendedSeries() {
  try {
    const response = await fetch(`${seriesApiUrl}&sort_by=popularity.desc`);
    const data = await response.json();
    console.log("Recommended Series Data:", data);
    displaySeries(data.results);
  } catch (error) {
    console.error("Error fetching recommended series:", error);
  }
}

//display movies

function displayMovies(movies) {
  const moviesContainer = document.getElementById("movies");
  if (!moviesContainer) {
    console.error("Movies container not found");
    return;
  }

  moviesContainer.innerHTML = "";

  movies.forEach((movie) => {
    const movieElement = document.createElement("div");
    movieElement.classList.add("movie");

    movieElement.innerHTML = `

    <div class="row" >
    <div class="column">
    <div class="card">
      <center>
      <img src="https://image.tmdb.org/t/p/w500${movie.poster_path}" alt="${movie.title} class="thumbnail" id="image"></img>
      </center>
      <h3 id="title">${movie.title}</h3>
    </div>
    </div>
    </div>

            
        `;

    moviesContainer.appendChild(movieElement);
  });
}

//display series

function displaySeries(series) {
  const seriesContainer = document.getElementById("series");
  if (!seriesContainer) {
    console.error("Series container not found");
    return;
  }
  seriesContainer.innerHTML = "";

  series.forEach((serie) => {
    const serieElement = document.createElement("div");
    serieElement.classList.add("series");

    serieElement.innerHTML = `

    <div class="row" >
    <div class="column">
    <div class="card">
      <center>
      <img src="https://image.tmdb.org/t/p/w500${serie.poster_path}" alt="${serie.name} class="thumbnail" id="image"></img>
      </center>
      <h3 id="title">${serie.name}</h3>
    </div>
    </div>
    </div>

            
        `;

    seriesContainer.appendChild(serieElement);
  });
}

//initialize the appropriate function based on the current page
window.onload = () => {
  fetchGenres();

  const genreId = localStorage.getItem("selectedGenreId");
  if (genreId) {
    const genreName = localStorage.getItem("selectedGenreName");
    const genreNameElement = document.getElementById("genre-name");
    if (genreNameElement) {
      genreNameElement.textContent = `- Genre: ${genreName} -`;
    }
    fetchMoviesByGenre(genreId);
  }

  if (window.location.pathname.endsWith("movies.html")) {
    fetchRecommendedMovies();
  }

  if (window.location.pathname.endsWith("series.html")) {
    fetchRecommendedSeries();
  }
};

//return movies for search form

function returnMovies(url) {
  const page_title = document.createElement("h1");
  page_title.innerHTML = "- results -";
  page_title.setAttribute("class", "page_h1");

  main.appendChild(page_title);

  const main_content = document.createElement("div");
  main_content.setAttribute("class", "section_content");
  main.appendChild(main_content);

  fetch(url)
    .then((res) => res.json())
    .then(function (data) {
      console.log(data.results);
      data.results.forEach((element) => {
        if (!element.poster_path) {
          return;
        }

        const div_card = document.createElement("div");
        div_card.setAttribute("class", "card");

        const div_row = document.createElement("div");
        div_row.setAttribute("class", "row");

        const div_column = document.createElement("div");
        div_column.setAttribute("class", "column");

        const image = document.createElement("img");
        image.setAttribute("class", "thumbnail");
        image.setAttribute("id", "image");

        const title = document.createElement("h3");
        title.setAttribute("id", "title");

        const center = document.createElement("center");

        title.innerHTML = `${element.title}`;
        image.src = IMG_PATH + element.poster_path;

        center.appendChild(image);
        div_card.appendChild(center);
        div_card.appendChild(title);
        div_column.appendChild(div_card);
        div_row.appendChild(div_column);

        main_content.appendChild(div_row);
      });
    });
}

form.addEventListener("submit", (e) => {
  e.preventDefault();
  main.innerHTML = "";

  const searchItem = search.value;

  if (searchItem) {
    returnMovies(SEARCHAPI + searchItem);
    search.value = "";
  }
});

form2.addEventListener("submit", (e) => {
  e.preventDefault();
  main.innerHTML = "";

  const searchItem = search2.value;

  if (searchItem) {
    returnMovies(SEARCHAPI + searchItem);
    search2.value = "";
    hamMenuToggle();
  }
});

//categories menu

const categories_btn_close = document.getElementById("btn_close");
const categories_btn_open = document.getElementById("btn_open");
const categories = document.getElementById("categories");

categories_btn_close.addEventListener("click", open);
categories_btn_open.addEventListener("click", open);

function open() {
  categories.classList.toggle("categories_active");
  categories_btn_close.classList.toggle("categories_btn_close");
  categories_btn_open.classList.toggle("categories_btn_open");
}

const hamMenu = document.querySelector(".ham_menu");
const offScreenMenu = document.querySelector(".off_screen_menu");
const links = document.querySelector(".off_screen_menu_links");
const body = document.querySelector("body");

//hamburger menu

hamMenu.addEventListener("click", () => {
  hamMenu.classList.toggle("active");
  offScreenMenu.classList.toggle("active");
  body.classList.toggle("active");
});

function hamMenuToggle() {
  hamMenu.classList.toggle("active");
  offScreenMenu.classList.toggle("active");
  body.classList.toggle("active");
}
