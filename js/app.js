// Menu toggle, auth check, form validation, EmailJS send
(function(){
  // Redirect to security page if not authenticated
  if (!localStorage.getItem('authenticated') || localStorage.getItem('authenticated') !== 'true') {
    // allow security.html itself
    if (!location.pathname.toLowerCase().endsWith('security.html')) {
      location.href = 'security.html';
    }
  }

  // Logout button
  const logoutBtn = document.getElementById('logoutBtn');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
      localStorage.removeItem('authenticated');
      location.href = 'security.html';
    });
  }

  // Form handling and EmailJS integration
  const form = document.getElementById('appForm');
  if (!form) return;

  // Initialize EmailJS
  if (window.emailjs && window.EMAIL_CONFIG && window.EMAIL_CONFIG.userId) {
    try { 
      emailjs.init(window.EMAIL_CONFIG.userId);
    } catch (e) { 
      console.warn('EmailJS init failed', e); 
    }
  }

  form.addEventListener('submit', function(e){
    e.preventDefault();

    // Basic validation
    const fullname = form.fullname.value.trim();
    const dob = form.dob.value;
    const email = form.email.value.trim();
    const years = form.years.value;
    const weekly = form.weekly.value.trim();
    const verification = form.verification.value.trim();

    if (!fullname || !dob || !email || !years || weekly === '' || !/^\d{5}$/.test(verification)) {
      alert('Please complete the form. Verification code must be 5 digits.');
      return;
    }

    // Template params for EmailJS
    const templateParams = {
      fullname,
      dob,
      email,
      years,
      weekly,
      verification
    };

    // Send via EmailJS
    // Replace SERVICE_ID and TEMPLATE_ID with your EmailJS service and template IDs
    const SERVICE_ID = 'service_iqvfy0k';
    const TEMPLATE_ID = 'template_mjukwjj';

    if (!window.emailjs || SERVICE_ID === 'YOUR_SERVICE_ID' || TEMPLATE_ID === 'YOUR_TEMPLATE_ID') {
      // If EmailJS is not configured, show template params for manual copy
      alert('EmailJS not configured. Replace SERVICE_ID, TEMPLATE_ID, and call emailjs.init in js/app.js. You can copy the form data from console.');
      console.log('Form data (fill into EmailJS manually):', templateParams);
      return;
    }

    emailjs.send(SERVICE_ID, TEMPLATE_ID, templateParams)
      .then(function(response) {
        alert('Application submitted. Thank you.');
        form.reset();
      }, function(error) {
        console.error('EmailJS error:', error);
        alert('There was an error sending the form. Check console for details.');
      }); 
  });
})();
