module.exports = {

  signupValidation: function(name, password, confirmation) {
    var errors = [];
    if(name.trim() === "") {
      errors.push("Name cannot be blank.")
    }
    if(password.trim() === "") {
      errors.push("Please enter a password.")
    }
    if(confirmation.trim() === "") {
      errors.push("Please confirm your password.")
    }
    return errors;
  },

  loginValidation: function(name, password) {
    var errors = [];
    if(name.trim() === "") {
      errors.push("Name cannot be blank.")
    }
    if(password.trim() === "") {
      errors.push("Passwod cannot be blank.")
    }
    return errors;
  },

}
