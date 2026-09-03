// Функция для переключения статуса "Изучено"
function toggleWordLearned(wordIndex, currentDay) {
    let learnedWords = JSON.parse(localStorage.getItem(`learned_${currentDay}`) || '[]');
    
    if (learnedWords.includes(wordIndex)) {
        learnedWords = learnedWords.filter(id => id !== wordIndex);
    } else {
        learnedWords.push(wordIndex);
    }
    
    localStorage.setItem(`learned_${currentDay}`, JSON.stringify(learnedWords));
    updateUI(); // Обновить интерфейс карточки (например, подсветить зеленым кнопку "Learned")
}
