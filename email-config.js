// Replace placeholders with your EmailJS/public key + service/template IDs.
// This file is loaded before js/app.js in your pages.
window.EMAIL_CONFIG = {
  userId: 'gyLf-PcV8iZLVgPzD',        // EmailJS public key (from dashboard)
  serviceId: 'service_s09rxcd',        // EmailJS service ID
  templateId: 'template_s5da7m5',     // EmailJS template ID
  
  templateVariables: {
    to_email: '235pgfe@gmail.com',
    subject_prefix: 'New Grant Application',
    from_name: '{{fullName}}',
    from_email: '{{email}}',
    application_id: '{{id}}',
    submitted_at: '{{submittedAt}}',
    message: '{{message}}'
  }
};

console.log('Email configuration loaded:', EMAIL_CONFIG);

// emailjs.init will be attempted by js/app.js if available


