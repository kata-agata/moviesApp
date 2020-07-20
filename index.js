const autocompleteConfig = { //object with config data which not change
  renderOption(movie) {
    const imgSrc = movie.Poster === 'N/A' ? '' : movie.Poster; // check if poster src exists, if not empty string leftleft
    return `
      <img src="${imgSrc}"/>
      ${movie.Title}(${movie.Year})
    `;
  },
  inputValue(movie){
    return movie.Title;
  },
  async fetchData(searchTerm) {
    const response = await axios.get('http://www.omdbapi.com/', {
      params: {
        apikey: '7a271520',
        s: searchTerm
      }
    }); // easy way to pass parameters with axios
    //console.log(response.data);
    if (response.data.Error) {
      return []; //if there is an Error response return empty array
    }
    return response.data.Search;
  }
};

createAutocomplete({
  ...autocompleteConfig, //make copy, and throw into this object
  root: document.querySelector('#left-autocomplete'),
  onOptionSelect(movie){
    document.querySelector('.tutorial').classList.add('is-hidden');// hidding tutorial class
    onMovieSelect(movie, document.querySelector('#left-summary'));
  }
});

createAutocomplete({
  ...autocompleteConfig, //make copy, and throw into this object
  root: document.querySelector('#right-autocomplete'),
  onOptionSelect(movie){
    document.querySelector('.tutorial').classList.add('is-hidden');// hidding tutorial class
    onMovieSelect(movie, document.querySelector('#right-summary'));
  }
});



const onMovieSelect = async (movie,summaryElement) => {
  const response = await axios.get('http://www.omdbapi.com/', {
    params: {
      apikey: '7a271520',
      i: movie.imdbID
    }
  });
  //console.log(response.data);
  summaryElement.innerHTML = movieTemplate(response.data);
};

const movieTemplate = (movieDetail) => { //html template of movie after click
  return `
    <article class="media">
      <figure class="media-left">
        <p class="image">
          <img src="${movieDetail.Poster}" />
        </p>
      </figure>
      <div class="media-content">
        <div class="content">
          <h1>${movieDetail.Title}</h1>
          <h4>${movieDetail.Genre}</h4>
          <p>${movieDetail.Plot}</p>
        </div>
      </div>
    </article>
    <article class="notification is-primary">
      <p class="title">${movieDetail.Awards}</p>
      <p class="subtitle">Awards</p>
    </article>
    <article class="notification is-primary">
      <p class="title">${movieDetail.BoxOffice}</p>
      <p class="subtitle">BoxOffice</p>
    </article>
    <article class="notification is-primary">
      <p class="title">${movieDetail.Metascore}</p>
      <p class="subtitle">Metascore</p>
    </article>
    <article class="notification is-primary">
      <p class="title">${movieDetail.imdbRating}</p>
      <p class="subtitle">IMDB Rating</p>
    </article>
    <article class="notification is-primary">
      <p class="title">${movieDetail.imdbVotes}</p>
      <p class="subtitle">IMDB Votes</p>
    </article>
  `;
};
