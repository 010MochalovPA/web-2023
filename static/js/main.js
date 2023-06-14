window.onload = () => {
  const button = document.querySelector('.menu-btn');
  const menu = document.querySelector('.menu');

  button.addEventListener('click', () => {
    button.classList.toggle('menu-btn_active');
    menu.classList.toggle('menu_active');
  })

  window.addEventListener('resize', () => {
    button.classList.remove('menu-btn_active');
    menu.classList.remove('menu_active');
  })
}