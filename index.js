const fetchData = async (searchTerm) => {
  const response = await axios.get('http://www.omdbapi.com/', {
    params: {
      apikey: '7a271520',
      s: searchTerm
    }
  }); // easy way to pass parameters with axios
  //console.log(response.data);
  if(response.data.Error){
    return [];//if there is an Error response return empty array
  }
  return  response.data.Search;
}; //getting all

const root = document.querySelector('.autocomplete');
root.innerHTML=`
<label><b>Search for a movie</b></label>
<input class="input" />
<div class="dropdown">
  <div class="dropdown-menu">
    <div class="dropdown-content results">

    </div>
  </div>
</div>
`;

const input = document.querySelector('input');
const dropdown = document.querySelector('.dropdown');
const resultsWrapper = document.querySelector('.results');


const onInput = debounce( async event => {
    const movies = await fetchData(event.target.value); //fetchData return a promise, so await and async need to be added to  return array of objects

    if(!movies.length){
      dropdown.classList.remove('is-active');
      return;
    }
    resultsWrapper.innerHTML=''; // clear before each search
    console.log(movies);
    dropdown.classList.add('is-active');
    for (let movie of movies) {
      const option = document.createElement('a');
      const imgSrc = movie.Poster === 'N/A' ? '' : movie.Poster;// check if poster src exists, if not empty string leftleft
      option.classList.add('dropdown-item');

      option.innerHTML = `
        <img src="${imgSrc}"/>
        ${movie.Title}
      `;
      option.addEventListener('click',()=>{
        dropdown.classList.remove('is-active');
        input.value = movie.Title;
        onMovieSelect(movie);
      })
      resultsWrapper.appendChild(option);
    }
},500);


input.addEventListener('input', onInput);// debounce can be use here also

document.addEventListener('click', event => {
  //console.log(event.target);//whenever click, it printout this element
  if(!root.contains(event.target)){ //when click outside the root
    dropdown.classList.remove('is-active');
  }
});//easy trick to close dropdown menu

const onMovieSelect = async movie =>{
  const response = await axios.get('http://www.omdbapi.com/', {
    params: {
      apikey: '7a271520',
      i: movie.imdbID
    }
  });
  //console.log(response.data);
  document.querySelector('#summary').innerHTML = movieTemplate(response.data);
};

const movieTemplate = (movieDetail)=>{ //html template of movie after click
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
