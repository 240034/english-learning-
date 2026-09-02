import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { 
    getAuth, 
    signInWithEmailAndPassword, 
    createUserWithEmailAndPassword, 
    signOut, 
    onAuthStateChanged 
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import { 
    getFirestore, 
    doc, 
    getDoc, 
    setDoc, 
    updateDoc 
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

// Ваши вставленные ключи:
const firebaseConfig = {
  apiKey: "AIzaSyBOr_Rg1YLdO0u-aBsajh2BVJj57GzWqRU",
  authDomain: "english-learning-journey-435d5.firebaseapp.com",
  projectId: "english-learning-journey-435d5",
  storageBucket: "english-learning-journey-435d5.firebasestorage.app",
  messagingSenderId: "224662329608",
  appId: "1:224662329608:web:41edae24cd4205612334bd"
};

// Инициализация Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

/* ==========================================
   1. ЛОГИКА УМНОГО СТРАЙКА (STREAK)
========================================== */
export async function syncUserStreak(userId) {
    const userRef = doc(db, "users", userId);
    const userSnap = await getDoc(userRef);
    const today = new Date().toISOString().split('T')[0]; // ГГГГ-ММ-ДД

    if (!userSnap.exists()) {
        await setDoc(userRef, {
            streak: { count: 1, lastVisitDate: today }
        }, { merge: true });
        updateStreakUI(1);
        return;
    }

    const userData = userSnap.data();
    const streakData = userData.streak || { count: 0, lastVisitDate: null };

    let currentStreak = streakData.count || 0;
    const lastVisit = streakData.lastVisitDate;

    if (!lastVisit) {
        currentStreak = 1;
    } else {
        const lastDate = new Date(lastVisit);
        const currentDate = new Date(today);
        const diffTime = Math.abs(currentDate - lastDate);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays === 1) {
            currentStreak += 1; // Зашел на следующий день
        } else if (diffDays > 1) {
            currentStreak = 1; // Пропустил хотя бы 1 день -> сброс
        }
        // Если diffDays === 0 (повторный заход за день) -> ничего не меняется
    }

    await updateDoc(userRef, {
        "streak.count": currentStreak,
        "streak.lastVisitDate": today
    });

    updateStreakUI(currentStreak);
}

function updateStreakUI(count) {
    const el = document.getElementById('user-streak');
    if (el) el.innerText = `${count} days 🔥`;
}

/* ==========================================
   2. СОХРАНЕНИЕ И ПОЛУЧЕНИЕ КВИЗОВ
========================================== */
export async function saveQuizResult(userId, dayKey, score, total, wrongWords) {
    const quizRef = doc(db, "users", userId, "quizResults", dayKey);
    await setDoc(quizRef, {
        dayKey: dayKey,
        score: score,
        total: total,
        percentage: Math.round((score / total) * 100),
        completedAt: new Date().toISOString(),
        wrongWords: wrongWords
    });
}

export async function getQuizResult(userId, dayKey) {
    const quizRef = doc(db, "users", userId, "quizResults", dayKey);
    const quizSnap = await getDoc(quizRef);
    return quizSnap.exists() ? quizSnap.data() : null;
}
