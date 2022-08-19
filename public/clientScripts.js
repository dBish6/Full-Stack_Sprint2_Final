// For expand button with mongodb.
const loadMoreMon = async () => {
  const expandBtn = document.querySelector("#monBtn");

  let movie_results = await fetch("/allMongoMovies");
  let movies = await movie_results.json();

  let currentMovieContainer = document.querySelector(".moviesContainer");
  // Gets every element with the .movie class.
  let allCurrentMovieHtml = currentMovieContainer.querySelectorAll(".movie");
  // Turns the object into a array and then maps each <a> tag href containing the id within the .movie class.
  let allMovieIds = Array.from(allCurrentMovieHtml).map((element) => {
    const id = element.querySelector("a").href;
    return id;
  });

  // Filters out all the movies that doesn't include the inital movie id.
  movies = movies.filter((movie) => !allMovieIds.includes(movie._id));
  console.log(movies);

  let output = "";
  expandBtn.addEventListener("click", () => {
    movies.forEach((movie) => {
      output += `<p class="movie">
                     <a href="${movie._id}"><b>${movie.title}</b> ( ${movie.year} )</a>
                   </p>`;
    });
    return (document.querySelector("#monMoreData").innerHTML = output);
  });
};

// For expand button with postgres.
const loadMoreGres = async () => {
  const expandBtn = document.querySelector("#gresBtn");

  let movie_results = await fetch("/allPostgresMovies");
  let movies = await movie_results.json();

  let output = "";
  expandBtn.addEventListener("click", () => {
    movies.forEach((film) => {
      output += `<p class="film">
                     <a href="${film.fid}"><b>${film.title}</b> ( ${film.release_year} )</a>
                   </p>`;
    });
    return (document.querySelector("#gresMoreData").innerHTML = output);
  });
};

window.addEventListener("load", () => {
  loadMoreMon();
  loadMoreGres();
});