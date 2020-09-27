const waitFor = (selector)=>{
  return new Promise((resolve,reject)=>{
    const interval = setInterval(()=>{
      if(document.querySelector(selector)){
        clearInterval(interval);
        clearTimeout(timeout);
        resolve();
      }
    },30);//run every 30ms
    const timeout = setTimeout(()=>{
      clearInterval(interval);
      reject();
    },2000);//runs only once

  });
};

beforeEach (() => {
  document.querySelector('#target').innerHTML='';// clear widget
  createAutocomplete({
    root: document.querySelector('#target'),
    fetchData(){ //we can use dummy data
      return [
        { Title: 'Avengers' },
        { Title: 'Not Avengers' },
        { Title: 'Other movie' }
      ];
    },
    renderOption(movie){
      return movie.Title; // Title first char i capital because API has this property
    }
  });
}); // globally set with mocha
//create autocomplete widget to be used in each test
//than the order of tests doesn't matter

it('Dropdown starts closed', ()=>{

  const dropdown = document.querySelector('.dropdown');

  expect(dropdown.className).not.to.include('is-active');

});

it('after searching, dropdown opens up', async() => {
  const input = document.querySelector('input');
  input.value = 'avengers';
  input.dispatchEvent(new Event('input'));
  // the widget has 500ms of delay in application
  await waitFor('.dropdown-item');//wait when it shows on screen
  const dropdown = document.querySelector('.dropdown');

  expect(dropdown.className).to.include('is-active');
});

it('after searching displays some results', async()=>{
  const input = document.querySelector('input');
  input.value = 'avengers';
  input.dispatchEvent(new Event('input'));

  await waitFor('.dropdown-item');
  const items = document.querySelectorAll('.dropdown-item');
  expect(items.length).to.equal(3);
})
