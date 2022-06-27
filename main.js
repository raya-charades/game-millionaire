"use strict";

(function (doc) {
  var state = {
    jsonData: [],
    currentQuestion: -1,
    myAnswer: '',
    prizeTable: [1, 2, 3, 5, 10, 15, 25, 50, 75, 100, 150, 250, 500, 750, 1000]
  };
  var api = 'https://api-charades-fzx9fn3j387f.netlify.app/.netlify/functions/quiz-millionaire';
  var challengePrize = doc.querySelector('.js-challengePrize');
  var questionText = doc.querySelector('.js-questionText');
  var choicesItem = doc.querySelectorAll('.js-choicesItem');
  var startModal = doc.querySelector('.js-startModal');
  var startButton = doc.querySelector('.js-startButton');
  var confirmModal = doc.querySelector('.js-confirmModal');
  var finalAnswer = doc.querySelector('.js-finalAnswer');
  var rethink = doc.querySelector('.js-rethink');
  var successModal = doc.querySelector('.js-successModal');
  var nextQuestion = doc.querySelector('.js-nextQuestion');
  var dropout = doc.querySelector('.js-dropout');
  var resultModal = doc.querySelector('.js-resultModal');
  var prize = doc.querySelector('.js-prize');
  var failedModal = doc.querySelector('.js-failedModal');
  var returnTop = doc.querySelectorAll('.js-returnTop');

  var gameStart = function gameStart() {
    startModal.classList.add('hidden');

    if (state.jsonData.length) {
      setQuestion();
    } else {
      fetch(api).then(function (res) {
        return res.json();
      }).then(function (res) {
        return state.jsonData = res;
      }).then(function () {
        return setQuestion();
      })["catch"](function () {
        return console.error('データ取得に失敗しました。');
      });
    }
  };

  var setQuestion = function setQuestion() {
    state.currentQuestion = state.currentQuestion + 1;

    if (successModal.className.indexOf('visible') > 0) {
      successModal.classList.remove('visible');
    }

    questionText.textContent = "Q".concat(state.currentQuestion + 1, " : ").concat(state.jsonData[state.currentQuestion].question);

    var getKey = function getKey(num) {
      return Object.keys(state.jsonData[state.currentQuestion].choices)[num];
    };

    Object.values(state.jsonData[state.currentQuestion].choices).forEach(function (d, i) {
      choicesItem[i].textContent = "".concat(getKey(i), " : ").concat(d);
      choicesItem[i].setAttribute('data-answer', getKey(i));
    });
    challengePrize.textContent = "\uFFE5".concat((state.prizeTable[state.currentQuestion] * 10000).toLocaleString());
  };

  var setMyAnswer = function setMyAnswer(e) {
    confirmModal.classList.add('visible');
    state.myAnswer = e.target.getAttribute('data-answer');
  };

  var checkAnswer = function checkAnswer() {
    var isSuccess = state.jsonData[state.currentQuestion].answer === state.myAnswer;
    var isLastQuestion = state.currentQuestion === state.jsonData.length - 1;

    if (isSuccess && isLastQuestion) {
      gameFinish();
      return;
    } else if (isSuccess) {
      successModal.classList.add('visible');
    } else {
      failedModal.classList.add('visible');
    }

    confirmModal.classList.remove('visible');
  };

  var returnThink = function returnThink() {
    confirmModal.classList.remove('visible');
  };

  var gameDropout = function gameDropout() {
    successModal.classList.remove('visible');
    resultModal.classList.add('visible');
    prize.textContent = "\uFFE5".concat((state.prizeTable[state.currentQuestion] * 10000).toLocaleString());
  };

  var gameFinish = function gameFinish() {
    resultModal.classList.add('visible');
    confirmModal.classList.remove('visible');
    successModal.classList.remove('visible');
    prize.textContent = "\uFFE5".concat((state.prizeTable[state.currentQuestion] * 10000).toLocaleString());
  };

  var gameReset = function gameReset() {
    failedModal.classList.remove('visible');
    resultModal.classList.remove('visible');
    startModal.classList.remove('hidden');
    state.currentQuestion = -1;
    state.myAnswer = '';
    challengePrize.textContent = '---';
    questionText.textContent = '---';
    choicesItem.forEach(function (e) {
      return e.textContent = '---';
    });
  };

  startButton.addEventListener('click', gameStart);
  choicesItem.forEach(function (d) {
    return d.addEventListener('click', setMyAnswer);
  });
  finalAnswer.addEventListener('click', checkAnswer);
  rethink.addEventListener('click', returnThink);
  nextQuestion.addEventListener('click', setQuestion);
  returnTop.forEach(function (d) {
    return d.addEventListener('click', gameReset);
  });
  dropout.addEventListener('click', gameDropout);
})(document);
