(function(doc) {
  const state = {
    jsonData: [],
    currentQuestion: -1,
    myAnswer: '',
    prizeTable: [1, 2, 3, 5, 10, 15, 25, 50, 75, 100, 150, 250, 500, 750, 1000]
  }

  const api = 'https://api-charades-fzx9fn3j387f.netlify.app/.netlify/functions/quiz-millionaire'

  const challengePrize = doc.querySelector('.js-challengePrize')
  const questionText = doc.querySelector('.js-questionText')
  const choicesItem = doc.querySelectorAll('.js-choicesItem')
  const startModal = doc.querySelector('.js-startModal')
  const startButton = doc.querySelector('.js-startButton')
  const confirmModal = doc.querySelector('.js-confirmModal')
  const finalAnswer = doc.querySelector('.js-finalAnswer')
  const rethink = doc.querySelector('.js-rethink')
  const successModal = doc.querySelector('.js-successModal')
  const nextQuestion = doc.querySelector('.js-nextQuestion')
  const dropout = doc.querySelector('.js-dropout')
  const resultModal = doc.querySelector('.js-resultModal')
  const prize = doc.querySelector('.js-prize')
  const failedModal = doc.querySelector('.js-failedModal')
  const returnTop = doc.querySelectorAll('.js-returnTop')

  const gameStart = () => {
    startModal.classList.add('hidden')
    if (state.jsonData.length) {
      setQuestion()
    } else {
      fetch(api)
        .then(res => res.json())
        .then(res => state.jsonData = res)
        .then(() => setQuestion())
        .catch(() => console.error('データ取得に失敗しました。'))
    }
  }

  const setQuestion = () => {
    state.currentQuestion = state.currentQuestion + 1
    if (successModal.className.indexOf('visible') > 0) {
      successModal.classList.remove('visible')
    }
    questionText.textContent = `Q${state.currentQuestion + 1} : ${state.jsonData[state.currentQuestion].question}`
    const getKey = num => Object.keys(state.jsonData[state.currentQuestion].choices)[num]
    Object.values(state.jsonData[state.currentQuestion].choices).forEach((d, i) => {
      choicesItem[i].textContent = `${getKey(i)} : ${d}`
      choicesItem[i].setAttribute('data-answer', getKey(i))
    })
    challengePrize.textContent = `￥${(state.prizeTable[state.currentQuestion] * 10000).toLocaleString()}`
  }

  const setMyAnswer = e => {
    confirmModal.classList.add('visible')
    state.myAnswer = e.target.getAttribute('data-answer')
  }

  const checkAnswer = () => {
    const isSuccess = state.jsonData[state.currentQuestion].answer === state.myAnswer
    const isLastQuestion = state.currentQuestion === state.jsonData.length - 1
    if (isSuccess && isLastQuestion) {
      gameFinish()
      return
    } else if (isSuccess) {
      successModal.classList.add('visible')
    } else {
      failedModal.classList.add('visible')
    }
    confirmModal.classList.remove('visible')
  }

  const returnThink = () => {
    confirmModal.classList.remove('visible')
  }

  const gameDropout = () => {
    successModal.classList.remove('visible')
    resultModal.classList.add('visible')
    prize.textContent = `￥${(state.prizeTable[state.currentQuestion] * 10000).toLocaleString()}`
  }

  const gameFinish = () => {
    resultModal.classList.add('visible')
    confirmModal.classList.remove('visible')
    successModal.classList.remove('visible')
    prize.textContent = `￥${(state.prizeTable[state.currentQuestion] * 10000).toLocaleString()}`
  }

  const gameReset = () => {
    failedModal.classList.remove('visible')
    resultModal.classList.remove('visible')
    startModal.classList.remove('hidden')
    state.currentQuestion = -1
    state.myAnswer = ''
    challengePrize.textContent = '---'
    questionText.textContent = '---'
    choicesItem.forEach(e => e.textContent = '---')
  }

  startButton.addEventListener('click', gameStart)
  choicesItem.forEach(d => d.addEventListener('click', setMyAnswer))
  finalAnswer.addEventListener('click', checkAnswer)
  rethink.addEventListener('click', returnThink)
  nextQuestion.addEventListener('click', setQuestion)
  returnTop.forEach(d => d.addEventListener('click', gameReset))
  dropout.addEventListener('click', gameDropout)

})(document)
