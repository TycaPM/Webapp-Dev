document.getElementById("username").addEventListener("input", function(ev){
  let userInput = ev.currentTarget;
  let username = userInput.value;
  const firstLetter = username.charAt(0);
  if(/[A-Z]/i.test(firstLetter)){
      if(username.length >= 3){
          userInput.classList.add("valid-text");
          userInput.classList.remove("invalid-text");
      }else {
          userInput.classList.remove("valid-text");
          userInput.classList.add("invalid-text");
      }
  }else {
      userInput.classList.remove("valid-text");
      userInput.classList.add("invalid-text");
  }
});

document.getElementById("password").addEventListener("input", function(ev) {
  const password = ev.currentTarget.value;
  const confirmPassword = document.getElementById("confirm-password").value;
  const minLength = 8;
  const requirements = [
    { regex: /[A-Z]/, met: false },
    { regex: /[0-9]/, met: false },
    { regex: /[*\/\-\+!@#$^&~[\]]/, met: false }
  ];

  for (const req of requirements) {
    if (req.regex.test(password)) {
      req.met = true;
    } else {
      req.met = false;
    }
  }

  const isPasswordValid = password.length >= minLength && requirements.every(req => req.met);
  const passwordsMatch = password === confirmPassword;

  const passwordField = ev.currentTarget;
  const confirmPasswordField = document.getElementById("confirm-password");

  passwordField.style.outlineColor = isPasswordValid ? "green" : "red";
  confirmPasswordField.style.outlineColor = isPasswordValid && passwordsMatch ? "green" : "red";
});

document.getElementById("confirm-password").addEventListener("input", function(ev) {
  const password = document.getElementById("password").value;
  const confirmPassword = ev.currentTarget.value;
  const isPasswordValid = password.length >= 8; // No need to recheck the requirements

  const confirmPasswordField = ev.currentTarget;
  confirmPasswordField.style.outlineColor = isPasswordValid && password === confirmPassword ? "green" : "red";
});

document.getElementById("reg-form").addEventListener("submit", function(ev){
  ev.preventDefault();
  validatePassword();
  if(formDateisbad){
      return;
  }else{
      ev.currentTarget.submit();
  }
})