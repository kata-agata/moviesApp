const createAutocomplete = ({
  root,
  renderOption,
  onOptionSelect,
  inputValue,
  fetchData
}) => {
  root.innerHTML = `
  <label><b>Search</b></label>
  <input class="input" />
  <div class="dropdown">
    <div class="dropdown-menu">
      <div class="dropdown-content results">

      </div>
    </div>
  </div>
  `;

  const input = root.querySelector('input');
  const dropdown = root.querySelector('.dropdown');
  const resultsWrapper = root.querySelector('.results');


  const onInput = async event => {
    const items = await fetchData(event.target.value); //fetchData return a promise, so await and async need to be added to  return array of objects

    if (!items.length) {
      dropdown.classList.remove('is-active');
      return;
    }
    resultsWrapper.innerHTML = ''; // clear before each search
    console.log(items);
    dropdown.classList.add('is-active');
    for (let item of items) {
      const option = document.createElement('a');

      option.classList.add('dropdown-item');

      option.innerHTML = renderOption(item);
      option.addEventListener('click', () => {
        dropdown.classList.remove('is-active');
        input.value =inputValue(item);
        onOptionSelect(item);
      })
      resultsWrapper.appendChild(option);
    }
  };

  input.addEventListener('input', debounce(onInput, 500)); // debounce can be use here also

  document.addEventListener('click', event => {
    //console.log(event.target);//whenever click, it printout this element
    if (!root.contains(event.target)) { //when click outside the root
      dropdown.classList.remove('is-active');
    }
  }); //easy trick to close dropdown menu
};
