// --- FIREBASE CONFIG ---
// DŮLEŽITÉ: Tento klíč byl označen jako uniklý.
// 1. Jděte do Google Cloud Console: https://console.cloud.google.com/apis/credentials
// 2. Vygenerujte NOVÝ API klíč.
// 3. Omezte (Restrict) nový klíč na vaše domény (localhost, omniscore.live).
// 4. Nahraďte níže uvedený klíč tím novým.

var firebaseConfig = {
    apiKey: "AIzaSyCJa6ACz6Z3JOoVD7RSLZkWMdwuwcsOOL4", // <--- ZDE VLOŽTE NOVÝ KLÍČ
    authDomain: "omniscore-live.firebaseapp.com",
    databaseURL: "https://omniscore-live-default-rtdb.europe-west1.firebasedatabase.app",
    projectId: "omniscore-live",
    storageBucket: "omniscore-live.firebasestorage.app",
    messagingSenderId: "1089053095317",
    appId: "1:1089053095317:web:d90f097e7df2a53e34f29c"
};
