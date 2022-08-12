const selectors = {
    boardContainer: document.querySelector('.board-container'),
    board: document.querySelector('.board'),
    moves: document.querySelector('.moves'),
    timer: document.querySelector('.timer'),
    start: document.querySelector('button'),
    reset: document.querySelector(`resetButton`),
    win: document.querySelector('.win')
}

const state = {
    gameStarted: false,
    flippedCards: 0,
    totalFlips: 0,
    totalTime: 0,
    loop: null
}

const shuffle = array => {
    const clonedArray = [...array]
console.log(array)
    for (let index = clonedArray.length - 1; index > 0; index--) {
        const randomIndex = Math.floor(Math.random() * (index + 1))
        const original = clonedArray[index]

        clonedArray[index] = clonedArray[randomIndex]
        clonedArray[randomIndex] = original
    }

    return clonedArray
}
const pickRandom = (array, items) => {
    const clonedArray = [...array]
    const randomPicks = []

    for (let index = 0; index < items; index++) {
        const randomIndex = Math.floor(Math.random() * clonedArray.length)

        randomPicks.push(clonedArray[randomIndex])
        clonedArray.splice(randomIndex, 1)
    }

    return randomPicks
}
const generateGame = () => {
    const dimensions = selectors.board.getAttribute('data-dimension')

    if (dimensions % 2 !== 0) {
        throw new Error("The dimension of the board must be an even number.")
    }
    


  const emojis = ['1.png','2.png','3.png','4.png','5.png','6.png','7.png','8.png']
   
    const picks = pickRandom(emojis, (dimensions * dimensions) / 2) 
    console.log("picks", picks);
    console.log(emojis)
    const items = shuffle([...picks, ...picks])
    console.log(items);
    const cards = `
        <div class="board" style="grid-template-columns: repeat(${dimensions}, auto)">
            ${items.map(item => 
                `
                <div class="card">
                    <div class="card-front"></div>
                    <div class="card-back" style=backgroundImage: url('images/1.png'),font-size: 4px;">${item}</div>
                </div>
            `).join('')}
       </div>
    `
    const parser = new DOMParser().parseFromString(cards, 'text/html')

    selectors.board.replaceWith(parser.querySelector('.board'))
    
  
}
// const resetGame = () => {
//     state.gameStarted = false
//     selectors.reset.classList.add('enabled')

//     state.loop = setInterval(() => {
//         state.totalTime--
//         selectors.moves.innerText = `${state.totalFlips} moves`
//         selectors.timer.innerText = `time: ${state.totalTime} sec`
//     }, 1000)
// }
const startGame = () => {
    state.gameStarted = true
    selectors.start.classList.add('disabled')

    state.loop = setInterval(() => {
        state.totalTime++

        selectors.moves.innerText = `${state.totalFlips} moves`
        selectors.timer.innerText = `time: ${state.totalTime} sec`
    }, 1000)
}
const flipBackCards = () => {
    document.querySelectorAll('.card:not(.matched)').forEach(card => {
        card.classList.remove('flipped')
    })

    state.flippedCards = 0
}
 function whenMatched(firstCard, secondCard){
    firstCard.classList.add('noDisplay')
            secondCard.classList.add('noDisplay')
    }   

const flipCard = card => {
    state.flippedCards++
    state.totalFlips++

    if (!state.gameStarted) {
        startGame()
    }

    if (state.flippedCards <= 2) {
        card.classList.add('flipped')
    }

    if (state.flippedCards === 2) {
        const flippedCards = document.querySelectorAll('.flipped:not(.matched)')

        if (flippedCards[0].innerText === flippedCards[1].innerText) {
            flippedCards[0].classList.add('matched')
            flippedCards[1].classList.add('matched')
        whenMatched(flippedCards[0], flippedCards[1]);
        }

        setTimeout(() => {
            flipBackCards()
        }, 1000)
    }

    


if (!document.querySelectorAll('.card:not(.flipped)').length) {
    setTimeout(() => {
        selectors.boardContainer.classList.add('flipped')
        selectors.win.innerHTML = `
            <span class="win-text">
                ${name} won!<br />
                with <span class="highlight">${state.totalFlips}</span> moves<br />
                under <span class="highlight">${state.totalTime}</span> seconds
            </span>
        `

        clearInterval(state.loop)
    }, 1000)
}
}

const attachEventListeners = () => {
document.addEventListener('click', event => {
    const eventTarget = event.target
    const eventParent = eventTarget.parentElement

    if (eventTarget.className.includes('card') && !eventParent.className.includes('flipped')) {
        flipCard(eventParent)
    } else if (eventTarget.nodeName === 'BUTTON' && !eventTarget.className.includes('disabled')) {
        startGame()
    }
})
}
resetButton.addEventListener('click', function(){
    window.location.reload();
})



generateGame()
attachEventListeners()
