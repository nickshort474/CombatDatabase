const _validate = (state)=> {
  // we are going to store errors for all fields
  // in a signle array
  const errors = [];

  console.log(state);

  for(let key in state){
    console.log(key + " = " + state[key]);
    
    
  }
 /* state.forEach((item)=>{
      console.log(state[item]);
      console.log(item);
  })
*/
 /* if (name.length === 0) {
    errors.push("Name can't be empty");
  }

  if (email.length < 5) {
    errors.push("Email should be at least 5 charcters long");
  }
  if (email.split("").filter(x => x === "@").length !== 1) {
    errors.push("Email should contain a @");
  }
  if (email.indexOf(".") === -1) {
    errors.push("Email should contain at least one dot");
  }

  if (password.length < 6) {
    errors.push("Password should be at least 6 characters long");
  }*/

  return errors;
}

exports._validate = _validate;
