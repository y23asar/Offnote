// -------- Auth --------
function toggleSignup() {
    const signupDiv = document.getElementById("signupDiv");
    signupDiv.style.display = signupDiv.style.display === "none" ? "block" : "none";
  }
  
  document.getElementById("signupForm").onsubmit = e => {
    e.preventDefault();
    const user = document.getElementById("newUsername").value;
    const pass = document.getElementById("newPassword").value;
    localStorage.setItem(user, pass);  // Store in localStorage
    alert("Signup successful!");
  };
  
  document.getElementById("loginForm").onsubmit = e => {
    e.preventDefault();
    const user = document.getElementById("username").value;
    const pass = document.getElementById("password").value;
    if (localStorage.getItem(user) === pass) {
      document.getElementById("authSection").style.display = "none";
      document.getElementById("appSection").style.display = "block";
    } else {
      alert("Invalid credentials");
    }
  };
  
  function logout() {
    document.getElementById("appSection").style.display = "none";
    document.getElementById("authSection").style.display = "block";
  }
  
  // -------- File Save, Load, QR --------
  
  function generateCode() {
    return Math.random().toString(36).substring(2, 8).toUpperCase(); // Generate unique code
  }
  
  async function saveOffline() {
    const content = document.getElementById("fileContent").value;
    let code = document.getElementById("fileCode").value.trim();
    if (!code) {
      code = generateCode();  // Generate code if empty
      document.getElementById("fileCode").value = code;
    }
    await saveFileToIDB(code, content);  // Save to IndexedDB
    alert("Saved offline with code: " + code);
  }
  
  async function loadFile() {
    const code = document.getElementById("fileCode").value.trim();
    if (!code) return alert("Enter code");
    const content = await getFileFromIDB(code);  // Retrieve from IndexedDB
    if (content) {
      document.getElementById("fileContent").value = content;
    } else {
      alert("No file found for this code");
    }
  }
  
  function generateQR() {
    const code = document.getElementById("fileCode").value.trim();
    if (!code) return alert("Enter file code first");
    const qrContainer = document.getElementById("qrContainer");
    qrContainer.innerHTML = '';
    new QRCode(qrContainer, code);  // Generate QR code
  }
  
  function downloadFile() {
    const content = document.getElementById("fileContent").value;
    const blob = new Blob([content], { type: "text/plain" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "offline-note.txt";
    a.click();  // Trigger download
  }
  
  // -------- File Upload --------
  
  function uploadFile() {
    const fileInput = document.getElementById("fileUpload");
    const file = fileInput.files[0];
    
    if (file) {
      const reader = new FileReader();
      reader.onload = async function (e) {
        const content = e.target.result;
        const code = generateCode();
        await saveFileToIDB(code, content);  // Save file content to IndexedDB
        document.getElementById("fileCode").value = code;  // Display file code
        alert("File uploaded and saved offline with code: " + code);
      };
      reader.readAsText(file);  // Read the uploaded file as text
    } else {
      alert("Please select a file to upload.");
    }
  }
