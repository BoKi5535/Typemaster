const words = [
    "the", "be", "to", "of", "and", "a", "in", "that", "have", "I",
    "it", "for", "not", "on", "with", "he", "as", "you", "do", "at",
    "this", "but", "his", "by", "from", "they", "we", "say", "her", "she",
    "or", "an", "will", "my", "one", "all", "would", "there", "their", "what",
    "so", "up", "out", "if", "about", "who", "get", "which", "go", "me",
    "when", "make", "can", "like", "time", "no", "just", "him", "know", "take",
    "people", "into", "year", "your", "good", "some", "could", "them", "see", "other",
    "than", "then", "now", "look", "only", "come", "its", "over", "think", "also",
    "back", "after", "use", "two", "how", "our", "work", "first", "well", "way",
    "even", "new", "want", "because", "any", "these", "give", "day", "most", "us",
    "is", "am", "are", "was", "were", "being", "been", "has", "had", "having",
    "may", "might", "must", "shall", "should", "ought", "can", "could", "will", "would",
    "say", "said", "says", "see", "saw", "seen", "goes", "went", "gone", "get",
    "got", "gotten", "make", "made", "know", "knew", "known", "think", "thought", "come",
    "came", "find", "found", "give", "gave", "given", "tell", "told", "ask", "asked",
    "call", "called", "try", "tried", "leave", "left", "put", "keep", "kept", "let",
    "begin", "began", "begun", "seem", "help", "talk", "turn", "start", "show", "hear",
    "heard", "play", "run", "move", "live", "believe", "bring", "happen", "write", "sit",
    "stand", "lose", "pay", "meet", "include", "continue", "set", "learn", "change", "lead",
    "understand", "watch", "follow", "stop", "create", "speak", "read", "allow", "add", "spend",
    "grow", "open", "walk", "win", "offer", "remember", "love", "consider", "appear", "buy",
    "wait", "serve", "die", "send", "expect", "build", "stay", "fall", "cut", "reach",
    "kill", "remain", "suggest", "raise", "pass", "sell", "require", "report", "decide", "pull",
    "return", "explain", "hope", "develop", "carry", "break", "receive", "agree", "support", "hit",
    "produce", "eat", "cover", "catch", "draw", "choose", "cause", "point", "listen", "realize",
    "place", "stand", "apply", "prepare", "build", "improve", "describe", "teach", "treat", "control",
    "manage", "enjoy", "visit", "affect", "avoid", "imagine", "explain", "prefer", "depend", "compare",
    "act", "fill", "save", "protect", "design", "check", "reduce", "listen", "wonder", "arrive",
    "stay", "mention", "answer", "fight", "laugh", "plan", "focus", "study", "join", "choose",
    "wear", "test", "cost", "miss", "enjoy", "share", "guess", "develop", "relate", "enter",
    "increase", "finish", "improve", "notice", "happen", "require", "recognize", "remember", "represent", "perform",
    "prefer", "replace", "reflect", "suppose", "succeed", "examine", "explore", "impress", "encourage", "determine",
    "attend", "exist", "depend", "express", "avoid", "fail", "imagine", "introduce", "repeat", "compare",
    "achieve", "afford", "complain", "deliver", "describe", "discuss", "inform", "measure", "offer", "prepare",
    "prevent", "produce", "provide", "recommend", "reduce", "relax", "respond", "solve", "suggest", "support",
    "appreciate", "arrange", "assume", "confirm", "contain", "contribute", "convince", "decide", "define", "delay",
    "depend", "design", "destroy", "develop", "divide", "emphasize", "encourage", "enjoy", "estimate", "examine",
    "experience", "explain", "express", "extend", "familiar", "focus", "gather", "guide", "handle", "identify",
    "improve", "include", "influence", "inform", "insist", "intend", "introduce", "invest", "involve", "lead"
  ];
  
  let currentWords = [];
  let currentIndex = 0;
  let correctCount = 0;
  let incorrectCount = 0;
  let soundEnabled = true;
  
  let timeLimit = null;
  let timeRemaining = null;
  let timerInterval = null;
  let typingStarted = false;
  let typingStartedTime = null;
  let testActive = true;
  
  let typedChars = [];
  let chartInstance = null;
  
  const resultHistory = [];
  
  const wordDisplay = document.getElementById('word-display');
  const wpmDisplay = document.getElementById('wpm');
  const accuracyDisplay = document.getElementById('accuracy');
  const soundToggle = document.getElementById('sound-toggle');
  const timerDisplay = document.getElementById('timer-display');
  const darkToggle = document.getElementById('dark-toggle');
  const audio = new Audio('key.mp3');
  const endSound = new Audio('done.mp3');

  
  function generateWords(count) {
    currentWords = [];
    for (let i = 0; i < count; i++) {
      currentWords.push(words[Math.floor(Math.random() * words.length)]);
    }
  
    wordDisplay.textContent = currentWords.join(' ');
    currentIndex = 0;
    correctCount = 0;
    incorrectCount = 0;
    typedChars = [];
    wpmDisplay.textContent = '';
    accuracyDisplay.textContent = '';
    typingStarted = false;
    typingStartedTime = null;
    testActive = true;
  
    clearInterval(timerInterval);
    timerInterval = null;
    timeRemaining = timeLimit;
  
    if (timeLimit) {
      timerDisplay.style.display = 'block';
      updateTimerDisplay();
    } else {
      timerDisplay.style.display = 'none';
    }
  }
  
  document.querySelectorAll('#word-buttons button').forEach(button => {
    button.addEventListener('click', () => {
      const count = parseInt(button.dataset.count);
      timeLimit = null;
      timerDisplay.style.display = 'none';
      generateWords(count);
    });
  });
  
  document.querySelectorAll('#time-buttons button').forEach(button => {
    button.addEventListener('click', () => {
      timeLimit = parseInt(button.dataset.time);
      timeRemaining = timeLimit;
      timerDisplay.style.display = 'block';
      updateTimerDisplay();
  
      const wordCount = timeLimit >= 30 ? 100 : 60;
      generateWords(wordCount);
    });
  });
  
  soundToggle.addEventListener('click', () => {
    soundEnabled = !soundEnabled;
    soundToggle.textContent = soundEnabled ? '🔊' : '🔇';
  });
  
  darkToggle.addEventListener('click', () => {
    document.body.classList.toggle('dark');
    updateChart();
  });
  
  function startTimer() {
    if (!timeLimit || timerInterval) return;
  
    timeRemaining = timeLimit;
    updateTimerDisplay();
  
    timerInterval = setInterval(() => {
      timeRemaining--;
      updateTimerDisplay();
  
      if (timeRemaining <= 0) {
        clearInterval(timerInterval);
        endTest();
      }
    }, 1000);
  }
  
  function updateTimerDisplay() {
    timerDisplay.textContent = `Time: ${timeRemaining}s`;
  }
  
  document.addEventListener('keydown', e => {
    if (!testActive || !currentWords.length || (timeLimit && timeRemaining <= 0)) return;
  
    if (!typingStarted) {
      typingStarted = true;
      typingStartedTime = Date.now();
      startTimer();
    }
  
    const fullText = currentWords.join(' ');
  
    if (e.key === "Backspace") {
      if (currentIndex > 0) {
        currentIndex--;
        typedChars[currentIndex] = null;
        highlightText();
      }
    } else if (e.key.length === 1) {
      const typedChar = e.key;
  
      if (soundEnabled) {
        audio.currentTime = 0;
        audio.play();
      }
  
      const expectedChar = fullText[currentIndex];
      typedChars[currentIndex] = typedChar;
  
      if (typedChar === expectedChar) {
        correctCount++;
      } else {
        incorrectCount++;
      }
  
      currentIndex++;
      highlightText();
  
      const elapsed = Date.now() - typingStartedTime;
      if (
        currentIndex >= fullText.length &&
        (!timeLimit || timeRemaining > 0) &&
        elapsed >= 2000
      ) {
        clearInterval(timerInterval);
        endTest();
      }
    }
  });
  
  function highlightText() {
    const fullText = currentWords.join(' ');
    let html = '';
  
    for (let i = 0; i < fullText.length; i++) {
      const expected = fullText[i];
      const typed = typedChars[i];
  
      if (i < currentIndex) {
        const spanClass = typed === expected ? 'correct' : 'incorrect';
        html += `<span class="${spanClass}">${expected}</span>`;
      } else {
        html += expected;
      }
    }
  
    wordDisplay.innerHTML = html;
  }
  
  function launchConfetti() {
    confetti({
      particleCount: 100,
      spread: 100,
      origin: { y: 0.6 }
    });
  }
  
  function endTest() {
    const totalTyped = correctCount + incorrectCount;
  
    let timeUsed = typingStartedTime
      ? (Date.now() - typingStartedTime) / 1000
      : (timeLimit || 1);
  
    if (timeUsed < 2) timeUsed = 2;
  
    const wpm = Math.round((correctCount / 5) / (timeUsed / 60));
    const accuracy = totalTyped ? Math.round((correctCount / totalTyped) * 100) : 0;
  
    wpmDisplay.textContent = `WPM: ${wpm}`;
    accuracyDisplay.textContent = `Accuracy: ${accuracy}%`;
  
    typingStarted = false;
    testActive = false;
    wordDisplay.innerHTML = '';
  
    resultHistory.push(wpm);
    updateChart();

    endSound.play();
  
    launchConfetti(); 
  }
  
  //chart setup which I needed to research a lotttt -0-
  
  function updateChart() {
    const labels = resultHistory.map((_, i) => `Test ${i + 1}`);
    const data = resultHistory;
  
    const ctx = document.getElementById('resultsChart').getContext('2d');
    if (chartInstance) chartInstance.destroy();
  
    const isDark = document.body.classList.contains('dark');
    const lineColor = isDark ? '#ffcc00' : '#222';
  
    chartInstance = new Chart(ctx, {
      type: 'line',
      data: {
        labels,
        datasets: [{
          label: 'WPM',
          data,
          borderColor: lineColor,
          backgroundColor: 'transparent',
          tension: 0.3,
          pointRadius: 5,
          pointHoverRadius: 7,
          pointBackgroundColor: lineColor,
          borderWidth: 2
        }]
      },
      options: {
        responsive: true,
        scales: {
          y: {
            beginAtZero: true,
            max: Math.max(...data, 60),
            ticks: {
              color: isDark ? '#ccc' : '#333'
            }
          },
          x: {
            ticks: {
              color: isDark ? '#ccc' : '#333'
            }
          }
        },
        plugins: {
          legend: {
            labels: {
              color: isDark ? '#ccc' : '#333'
            }
          }
        }
      }
    });
  }
  
  function updateClock() {
    const clock = document.getElementById('clock');
    const now = new Date();
    clock.textContent = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }
  
  setInterval(updateClock, 1000);
  
  window.addEventListener('DOMContentLoaded', () => {
    generateWords(30);
    updateClock();
  });
  
  window.addEventListener("keydown", function(event) {
    if (event.code === "Space" || event.key === " ") {
      event.preventDefault();
    }
  });


  asdfasdfasdfasd
  window.addEventListener("contextmenu", function(event) {
    event.preventDefault();
  });


  