const debounce = (func, delay=1000) => {
  let timeoutId;
  return (...args)=>{
    if (timeoutId){
      clearTimeout(timeoutId);
    }
      timeoutId = setTimeout(() => {
      func.apply(null,args); //take all arguments
    },delay)
  };
} //debounce is a helper function, takes function as argument and return function
