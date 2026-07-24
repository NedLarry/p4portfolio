    const textarea = document.getElementById('email-body');
    const charCount = document.getElementById('char-count');
    const submitBtn = document.getElementById('submit-btn');
    const successBanner = document.getElementById('success-banner');
    const nameInput = document.getElementById('sender-name');
    const emailInput = document.getElementById('sender-email');
    const phoneInput = document.getElementById('sender-phone');
    const form = document.querySelector('.contact-form');

    textarea.addEventListener('input', () => {
      const len = textarea.value.length;
      charCount.textContent = len + ' / 2000';
      charCount.className = 'char-count' + (len >= 2000 ? ' over' : len > 1800 ? ' warn' : '');
    });

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = nameInput.value.trim();
      const fromEmailAddress = emailInput.value.trim();
      const phoneNumber = phoneInput.value.trim();
      const text = textarea.value.trim();
      const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(fromEmailAddress);

      nameInput.classList.toggle('error', !name);
      emailInput.classList.toggle('error', !emailValid);
      phoneInput.classList.toggle('error', !phoneNumber);
      textarea.classList.toggle('error', !text);

      if (!name || !emailValid || !phoneNumber || !text) return;

      submitBtn.textContent = 'Sending…';
      submitBtn.disabled = true;

      fetch('/contactme', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'access-control-allow-origin': '*'
        },
        body: JSON.stringify({ name, fromEmailAddress, phoneNumber, text })
      })
      .then(response => response.json())
      .then(data => {
        console.log('Success:', data);
      })
      .catch(error => console.error('Error:', error));

      setTimeout(() => {
        successBanner.style.display = 'flex';
        submitBtn.style.display = 'none';
        nameInput.value = '';
        emailInput.value = '';
        phoneInput.value = '';
        textarea.value = '';
        charCount.textContent = '0 / 2000';
        charCount.className = 'char-count';
        nameInput.classList.remove('error');
        emailInput.classList.remove('error');
        phoneInput.classList.remove('error');
        textarea.classList.remove('error');
      }, 800);
    });