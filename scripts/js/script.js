// Hiding preloader
window.addEventListener("load", () => {
  const preloader = document.querySelector(".preloader");
  if (preloader) {
    preloader.classList.add("hidePreloader");
  }
  document.body.style.overflow = "visible";
});
const elements = document.querySelectorAll(".scroll-down");
window.addEventListener("scroll", slideUp);
function slideUp() {
  for (var i = 0; i < elements.length; i++) {
    const element = elements[i];
    const distInView =
      element.getBoundingClientRect().top - window.innerHeight + 30;
    if (distInView < 0) {
      element.classList.add("inView");
    } else {
      element.classList.remove("inView");
    }
  }
}
slideUp();

// navbar toggle
const navButton = document.querySelector(".navbar-toggler");
const navMenu = document.querySelector(".navbar-collapse");
if (navButton && navMenu) {
  navButton.addEventListener("click", () => {
    navMenu.classList.toggle("toggleNav");
  });
  document.querySelectorAll(".nav-link").forEach((link) =>
    link.addEventListener("click", () => {
      navMenu.classList.remove("toggleNav");
    })
  );
}

// stopping transition during resizing
let transitionStopper;
window.addEventListener("resize", () => {
  document.body.classList.add("resize-transition-stopper");
  clearTimeout(transitionStopper);
  transitionStopper = setTimeout(() => {
    document.body.classList.remove("resize-transition-stopper");
  }, 400);
});

// showing navbar after scrolling
window.addEventListener("scroll", () => {
  let position =
    window.pageYOffset ||
    document.documentElement.scrollTop ||
    document.body.scrollTop ||
    0;
  const navbar = document.querySelector(".navbar");
  if (!navbar) return;
  if (position >= 0) {
    navbar.style.display = "block";
  } else {
    navbar.style.display = "none";
  }
});

//contact
const contactForm = document.querySelector("#contactForm");

const firstName = document.querySelector("#firstName");
const firstNameError = document.querySelector("#firstName-error");

const email = document.querySelector("#email");
const emailError = document.querySelector("#email-error");

const message = document.querySelector("#message");
const messageError = document.querySelector("#message-error");

const success = document.querySelector(".success");
const submitIfValid = document.querySelector(".submit");

function contactValidation(e) {
  e.preventDefault();
  const firstNameLength = numberOfCharacters(firstName.value, 1);
  const messageLength = numberOfCharacters(message.value, 1);
  const emailCheck = emailValidation(email.value);

  if (firstNameLength && messageLength && emailCheck) {
    success.innerHTML =
      '<div class="success">Your message has been successfully sent. I will contact you very soon!</div>';
  } else {
    success.innerHTML = "";
  }
  if (firstNameLength === true) {
    firstNameError.style.display = "none";
  } else {
    firstNameError.style.display = "block";
  }

  if (emailCheck === true) {
    emailError.style.display = "none";
  } else {
    emailError.style.display = "block";
  }
  if (messageLength === true) {
    messageError.style.display = "none";
  } else {
    messageError.style.display = "block";
  }

  contactForm.reset();
}

if (contactForm) {
  contactForm.addEventListener("submit", contactValidation);
}

function numberOfCharacters(value, len) {
  if (value.trim().length > len) {
    return true;
  } else {
    return false;
  }
}

function emailValidation(email) {
  const regEx = /\S+@\S+\.\S+/;
  const patternMatches = regEx.test(email);
  return patternMatches;
}

const checkCharacterType = function checkIfOnlyLetter(field) {
  if (/^[a-zA-Z ]+$/.test(field.value)) {
    setValid(field);
    return true;
  } else {
    setInvalid(field, `$(field.name)must contain only letter`);
    return false;
  }
};

// Glitter scroll effect for logo and name
const glitterElems = document.querySelectorAll('.glitter-scroll');
function updateGlitterOnScroll() {
  const p = (window.scrollY / 3) % 200;
  glitterElems.forEach((el) => {
    el.style.backgroundPosition = `${p}% 50%`;
  });
}
window.addEventListener('scroll', updateGlitterOnScroll);
updateGlitterOnScroll();
