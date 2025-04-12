// service.js

// Replace with your Backendless APP_ID and API_KEY
const APP_ID = "YOUR-BACKENDLESS-APP-ID";
const API_KEY = "YOUR-BACKENDLESS-REST-API-KEY";
Backendless.initApp(APP_ID, API_KEY);

// Save a note (offline if needed)
function saveNote(note) {
  if (!navigator.onLine) {
    saveNoteOffline(note);
  } else {
    Backendless.Data.of("Notes").save(note)
      .then(saved => {
        console.log("Note saved online:", saved);
      })
      .catch(err => {
        console.error("Save failed, saving offline:", err);
        saveNoteOffline(note);
      });
  }
}

// Save note to localStorage for offline usage
function saveNoteOffline(note) {
  let notes = JSON.parse(localStorage.getItem("offlineNotes")) || [];
  notes.push(note);
  localStorage.setItem("offlineNotes", JSON.stringify(notes));
  console.log("Note saved offline:", note);
}

// Sync offline notes when online
function syncOfflineNotes() {
  let notes = JSON.parse(localStorage.getItem("offlineNotes")) || [];
  if (notes.length === 0) return;

  notes.forEach(note => {
    Backendless.Data.of("Notes").save(note)
      .then(saved => {
        console.log("Offline note synced:", saved);
        // Remove synced note
        notes = notes.filter(n => n !== note);
        localStorage.setItem("offlineNotes", JSON.stringify(notes));
      })
      .catch(err => {
        console.error("Failed to sync:", err);
      });
  });
}

// Auto-sync when internet comes back
window.addEventListener("online", syncOfflineNotes);

// Export saveNote function to be used in your app
window.saveNote = saveNote;
