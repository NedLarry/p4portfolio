    const textarea = document.getElementById('email-body');
    const charCount = document.getElementById('char-count');
    const submitBtn = document.getElementById('submit-btn');
    const successBanner = document.getElementById('success-banner');
    const emailInput = document.getElementById('sender-email');
    const form = document.querySelector('.contact-form');

    textarea.addEventListener('input', () => {
      const len = textarea.value.length;
      charCount.textContent = len + ' / 2000';
      charCount.className = 'char-count' + (len >= 2000 ? ' over' : len > 1800 ? ' warn' : '');
    });

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const fromEmailAddress = emailInput.value.trim();
      const text = textarea.value.trim();
      const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(fromEmailAddress);

      emailInput.classList.toggle('error', !emailValid);
      textarea.classList.toggle('error', !text);

      if (!emailValid || !text) return;

      submitBtn.textContent = 'Sending…';
      submitBtn.disabled = true;

      fetch('https://relaxed-torrone-ead861.netlify.app/contactme', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ fromEmailAddress, text })
      })
      .then(response => response.json())
      .then(data => {
        console.log('Success:', data);
      })
      .catch(error => console.error('Error:', error));

      setTimeout(() => {
        successBanner.style.display = 'flex';
        submitBtn.style.display = 'none';
        emailInput.value = '';
        textarea.value = '';
        charCount.textContent = '0 / 2000';
        charCount.className = 'char-count';
        emailInput.classList.remove('error');
        textarea.classList.remove('error');
      }, 800);
    });