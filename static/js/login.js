const emailField = document.getElementById('email');
const passwordField = document.getElementById('password');
const passVisibleToggle = document.querySelector('.login-input-password-toggle');
const inputs = document.querySelectorAll('.input-field');
const loginButton = document.querySelector('.primary-button_login');

const fields = document.querySelectorAll('.field');

loginButton.addEventListener('click', () => {
  const reg = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;
  const email = emailField.value;
  const password = passwordField.value;

  fields.forEach(field => {
    const error = field.querySelector('.error');
    const input = field.querySelector('.input-field');
    error.innerHTML = '';
    input.classList.remove('incorrect');
    if (!field.querySelector('.input-field').value)
    {
      const label = field.querySelector('.input-label');
      error.innerHTML = `${label.innerHTML} is required`;
      input.classList.add('incorrect');
      setTimeout(() => {
        error.innerHTML = '';
        input.classList.remove('incorrect');
      }, 5000);
      return;
    } 
  });

  if (!email || !password)
  {
    return;
  }

  console.log(JSON.stringify({
    email: email,
    password: password,
  }))
})

inputs.forEach(input => input.addEventListener('input', (e) => {
  const inputValue = e.target.value;
  inputValue ? e.target.classList.add('fill') : e.target.classList.remove('fill');
}));

const togglePassword = () => {
  const type = passwordField.getAttribute('type');
  type == 'password' ? passwordField.setAttribute('type', 'text') : passwordField.setAttribute('type', 'password');
  passVisibleToggle.classList.toggle('visible-password');
}

passVisibleToggle.addEventListener('click', togglePassword);