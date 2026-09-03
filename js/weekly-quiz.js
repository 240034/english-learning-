import { weeklyWords } from './words-data.js'; // Массив из 500 слов вашей недели

document.addEventListener('DOMContentLoaded', () => {
    let currentPartWords = [];
    let currentIndex = 0;
    
    const dateDisplay = document.getElementById('current-date-display');
    const partSelect = document.getElementById('part-select');
    const targetWordEl = document.getElementById('target-word');
    const optionsContainer = document.getElementById('options-container');
    const questionTracker = document.getElementById('question-tracker');
    const nextBtn = document.getElementById('next-btn');

    // 1. Отображение текущей даты
    const today = new Date();
    const dateString = today.toISOString().split('T')[0]; // ГГГГ-ММ-ДД
    dateDisplay.textContent = `Сегодня: ${today.toLocaleDateString('ru-RU')}`;

    // 2. Генератор случайных чисел с сидом (чтобы порядок менялся ежедневно)
    function seededRandom(seed) {
        let x = Math.sin(seed++) * 10000;
        return x - Math.floor(x);
    }

    // Алгоритм перемешивания Фишера-Йейтса с учетом текущего дня
    function shuffleByDate(array, dateStr) {
        const shuffled = [...array];
        let numericSeed = dateStr.split('-').reduce((acc, val) => acc + parseInt(val), 0);
        
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(seededRandom(numericSeed + i) * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        return shuffled;
    }

    // 3. Загрузка выбранной части (Part 1..5)
    function loadPart(partNumber) {
        const wordsPerPage = 100;
        const startIndex = (partNumber - 1) * wordsPerPage;
        const endIndex = startIndex + wordsPerPage;

        // Берем 100 слов для этой части
        const rawPartWords = weeklyWords.slice(startIndex, endIndex);

        // Рандомизируем порядок на основе сегодняшней даты
        currentPartWords = shuffleByDate(rawPartWords, dateString);
        
        currentIndex = 0;
        renderQuestion();
    }

    // 4. Отрисовка текущего вопроса
    function renderQuestion() {
        nextBtn.style.display = 'none';
        optionsContainer.innerHTML = '';

        if (currentIndex >= currentPartWords.length) {
            targetWordEl.textContent = "Part завершен! 🎉";
            questionTracker.textContent = "";
            return;
        }

        const currentWord = currentPartWords[currentIndex];
        targetWordEl.textContent = currentWord.word;
        questionTracker.textContent = `Вопрос ${currentIndex + 1} из ${currentPartWords.length}`;

        // Формирование вариантов ответа (1 правильный + 3 случайных)
        const options = generateOptions(currentWord);

        options.forEach(option => {
            const btn = document.createElement('button');
            btn.className = 'option-btn';
            btn.textContent = option.translation;
            btn.addEventListener('click', () => checkAnswer(btn, option.isCorrect));
            optionsContainer.appendChild(btn);
        });
    }

    // Генерация неверных вариантов
    function generateOptions(correctWord) {
        const options = [{ translation: correctWord.translation, isCorrect: true }];
        
        while (options.length < 4 && options.length < weeklyWords.length) {
            const randomIndex = Math.floor(Math.random() * weeklyWords.length);
            const randomTranslation = weeklyWords[randomIndex].translation;
            
            if (!options.some(o => o.translation === randomTranslation)) {
                options.push({ translation: randomTranslation, isCorrect: false });
            }
        }

        return options.sort(() => Math.random() - 0.5);
    }

    // Проверка ответа
    function checkAnswer(selectedBtn, isCorrect) {
        const allBtns = optionsContainer.querySelectorAll('.option-btn');
        allBtns.forEach(btn => btn.disabled = true);

        if (isCorrect) {
            selectedBtn.classList.add('correct');
        } else {
            selectedBtn.classList.add('wrong');
        }

        nextBtn.style.display = 'block';
    }

    // Переключение Part
    partSelect.addEventListener('change', (e) => {
        loadPart(parseInt(e.target.value));
    });

    // Следующий вопрос
    nextBtn.addEventListener('click', () => {
        currentIndex++;
        renderQuestion();
    });

    // Инициализация загрузки первой части
    loadPart(1);
});
