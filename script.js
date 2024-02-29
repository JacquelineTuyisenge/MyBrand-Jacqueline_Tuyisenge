// Add a class to the header when the user scrolls down, and remove it when they scroll to the top
window.onscroll = function() {
    const header = document.querySelector('header');
    const scrollPosition = window.scrollY;

    if (scrollPosition > 50) { // Adjust the scroll position value based on your needs
        header.classList.add('sticky');
    } else {
        header.classList.remove('sticky');
    }
};

// js for resposive navbar
  const hamburgerIcon = document.getElementById('hamburger');
  const exitIcon = document.getElementById('exit');
  const menu = document.querySelector('.menu');

  hamburgerIcon.addEventListener('click', () => {
      menu.classList.toggle('show');
      hamburgerIcon.style.display = 'none';
      exitIcon.style.display = 'block';
  });

  exitIcon.addEventListener('click', () => {
      menu.classList.remove('show');
      exitIcon.style.display = 'none';
      hamburgerIcon.style.display = 'block';
  });


// contact form validation

const name = document.getElementById('name');
const email = document.getElementById('email');
const message = document.getElementById('message');
const form = document.getElementById('contact-form');
const errorElement = document.getElementById('error');

form.addEventListener('submit', (e) => {
    //errors
    let messages = [];

    if (name.value === '' || name.value == null){
        messages.push('Name is required')
    }

    if (message.value.length <= 19){
        messages.push('Message can not be less than 20 characters')
    }

    if (messages.length > 0){
        e.preventDefault();
        errorElement.innerText = messages.join(', ')
    }
    
})