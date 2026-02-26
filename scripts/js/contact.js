document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("contactForm");
  if (!form) return;

  const submitBtn = form.querySelector('button[type="submit"]');
  const nameEl = form.querySelector('input[type="text"]');
  const emailEl = form.querySelector('input[type="email"]');
  const msgEl = form.querySelector("textarea");

  function isEmail(v) {
    return /\S+@\S+\.\S+/.test(v);
  }

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const name = nameEl.value.trim();
    const email = emailEl.value.trim();
    const message = msgEl.value.trim();

    if (name.length < 2 || !isEmail(email) || message.length < 2) {
      alert("Please fill in your name, a valid email, and a message.");
      return;
    }

    submitBtn.disabled = true;
    submitBtn.innerHTML =
      '<i class="fas fa-spinner fa-spin mr-2"></i> Sending...';

    try {
      await emailjs.send("service_khjna8b", "template_u5mb26w", {
        from_name: name,
        from_email: email,
        message,
        to_name: "Azeb",
      });

      submitBtn.innerHTML = '<i class="fas fa-check mr-2"></i> Sent!';
      form.reset();

      setTimeout(() => {
        submitBtn.disabled = false;
        submitBtn.innerHTML =
          '<i class="fas fa-paper-plane mr-2"></i> Send Message';
      }, 2500);
    } catch (err) {
      console.error("EmailJS error:", err);
      submitBtn.innerHTML =
        '<i class="fas fa-exclamation-circle mr-2"></i> Failed';
      setTimeout(() => {
        submitBtn.disabled = false;
        submitBtn.innerHTML =
          '<i class="fas fa-paper-plane mr-2"></i> Send Message';
      }, 2500);
    }
  });
});
