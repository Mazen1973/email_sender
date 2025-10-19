const sendBtn = document.getElementById("sendBtn");
const statusEl = document.getElementById("status");

// Form validation
function validateForm() {
  const name = document.getElementById("name").value.trim();
  const email = document.getElementById("email").value.trim();
  const recipientEmail = document.getElementById("recipient_email").value.trim();
  const message = document.getElementById("message").value.trim();
  
  if (!name || !email || !recipientEmail || !message) {
    statusEl.textContent = "❌ Please fill in all fields";
    statusEl.className = "error";
    return false;
  }
  
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    statusEl.textContent = "❌ Please enter a valid sender email address";
    statusEl.className = "error";
    return false;
  }
  
  if (!emailRegex.test(recipientEmail)) {
    statusEl.textContent = "❌ Please enter a valid recipient email address";
    statusEl.className = "error";
    return false;
  }
  
  return true;
}

// Enhanced send function with better UX
sendBtn.addEventListener("click", async () => {
  if (!validateForm()) return;
  
  // Update button state
  sendBtn.disabled = true;
  sendBtn.innerHTML = '<span class="loading"></span> Sending...';
  statusEl.textContent = "Sending your message...";
  statusEl.className = "";
  
  const params = {
    from_name: document.getElementById("name").value.trim(),
    from_email: document.getElementById("email").value.trim(), // The person's email (who filled the form)
    message: document.getElementById("message").value.trim(),
    to_email: document.getElementById("recipient_email").value.trim(), // The recipient email (where messages go)
    subject: "New Contact Form Message"
  };

  try {
    // Log the parameters being sent
    console.log("Sending email with parameters:", params);
    console.log("Service ID: service_e9ef6xg");
    console.log("Template ID: template_jftmbat");
    console.log("Recipient email:", document.getElementById("recipient_email").value.trim());
    console.log("Full params object:", JSON.stringify(params, null, 2));
    
    // Get credentials from config file
    const serviceId = window.EMAILJS_CONFIG.SERVICE_ID;
    const templateId = window.EMAILJS_CONFIG.TEMPLATE_ID;
    
    const result = await emailjs.send(serviceId, templateId, params);
    
    console.log("EmailJS Success:", result);
    statusEl.textContent = "✅ Message sent successfully!";
    statusEl.className = "success";
    
    // Reset form
    document.getElementById("name").value = "";
    document.getElementById("email").value = "";
    document.getElementById("recipient_email").value = "";
    document.getElementById("message").value = "";
    
    // Reset button after delay
    setTimeout(() => {
      sendBtn.disabled = false;
      sendBtn.innerHTML = "Send Message";
    }, 2000);
    
  } catch (err) {
    console.error("Full EmailJS Error:", err);
    console.error("Error status:", err.status);
    console.error("Error text:", err.text);
    console.error("Error details:", err);
    
    // More specific error messages
    let errorMessage = "❌ Failed to send message. ";
    
    if (err.status === 400) {
      errorMessage += "Template or service configuration error. Check EmailJS dashboard.";
    } else if (err.status === 401) {
      errorMessage += "Authentication failed. Check your public key.";
    } else if (err.status === 403) {
      errorMessage += "Access denied. Check your service permissions.";
    } else if (err.status === 404) {
      errorMessage += "Service or template not found. Check your IDs.";
    } else {
      errorMessage += "Please try again.";
    }
    
    statusEl.textContent = errorMessage;
    statusEl.className = "error";
    
    // Reset button
    sendBtn.disabled = false;
    sendBtn.innerHTML = "Send Message";
  }
});

// Add enter key support for textarea
document.getElementById("message").addEventListener("keydown", (e) => {
  if (e.key === "Enter" && e.ctrlKey) {
    sendBtn.click();
  }
});

// Add focus animations
document.querySelectorAll("input, textarea").forEach(element => {
  element.addEventListener("focus", () => {
    element.style.transform = "translateY(-2px)";
  });
  
  element.addEventListener("blur", () => {
    element.style.transform = "translateY(0)";
  });
});