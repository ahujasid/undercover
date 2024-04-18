const wordList = [
    ['Apple', 'Banana'],
    ['Car', 'Truck'],
    ['Dog', 'Cat'],
    // Add more word pairs here
  ];
  
  let players = [];
  let civilianWord = '';
  let imposterWord = '';
  let currentPlayerIndex = 0;
  let numCivilians = 0;
  let numImposters = 0;
  let totalPlayers = 0;
  let votedPlayer = null;
  let votingPhase = false;
  let numMrWhite = 0;
  
  const playerForm = document.getElementById('player-form');
  const playerNameInput = document.getElementById('player-name');
  const startGameButton = document.getElementById('start-game');
  const numCiviliansInput = document.getElementById('num-civilians');
  const numImpostersInput = document.getElementById('num-imposters');
  const playerListElement = document.getElementById('player-list');
  const startDiscussionButton = document.getElementById('start-discussion');
  const voteOutButton = document.getElementById('vote-out');
  const gameStatusElement = document.getElementById('game-status');
  
  startGameButton.addEventListener('click', () => {
    numCivilians = parseInt(numCiviliansInput.value);
    numImposters = parseInt(numImpostersInput.value);
    numMrWhite = parseInt(document.getElementById('num-mr-white').value);
    totalPlayers = numCivilians + numImposters + numMrWhite;
    if (totalPlayers > 0) {
      document.getElementById('game-settings').classList.add('hidden');
      document.getElementById('player-setup').classList.remove('hidden');
      setWords();
    } else {
      gameStatusElement.textContent = 'Please select at least one player.';
    }
  });
  
  playerForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const playerName = playerNameInput.value.trim();
    if (playerName !== '') {
      players.push({ name: playerName, role: '' });
      playerNameInput.value = '';
      assignRolesAndWords();
      showPlayerWord();
    }
  });
  
  startDiscussionButton.addEventListener('click', startDiscussion);
  voteOutButton.addEventListener('click', voteOut);
  
  function updatePlayerList() {
    const playerListItems = document.getElementById('player-list-items');
    playerListItems.innerHTML = '';
    players.forEach((player, index) => {
      const listItem = document.createElement('li');
      listItem.textContent = player.name;
      if (player.eliminated) {
        listItem.classList.add('eliminated');
        listItem.textContent += ` (${player.role})`;
      } else if (votingPhase) {
        listItem.addEventListener('click', () => confirmVote(player));
      }
      playerListItems.appendChild(listItem);
    });
  }


  function confirmVote(player) {
    
    if (confirm(`Are you sure you want to vote out ${player.name}?`)) {
      player.eliminated = true;
      if (player.role === 'Mr. White') {
        let guess = prompt("Mr. White, guess the word:");
        if (guess.toLowerCase() === civilianWord.toLowerCase()) {
          alert("Mr. White won the game!");
          promptResetGame();
        }
        else{
          alert("Wrong guess.");
        }
      }
      else{
        checkWinCondition();
      }
      updatePlayerList();
    }
  }
  


  function setWords(){
    const randomIndex = Math.floor(Math.random() * wordList.length);
    [civilianWord, imposterWord] = wordList[randomIndex];
    console.log(civilianWord, imposterWord);
  }

function checkWinCondition() {
    const remainingCivilians = players.filter(player => player.role === 'Civilian' && !player.eliminated);
    const remainingImposters = players.filter(player => player.role === 'Imposter' && !player.eliminated);
  
    if (remainingCivilians.length === 0) {
      alert('Imposters win!');
      promptResetGame();
    } else if (remainingImposters.length === 0) {
      alert('Civilians win!');
      promptResetGame();
    }
  }
  
  function promptResetGame() {
    if (confirm('Do you want to reset the game?')) {
      resetGame();
    }
  }

  function resetGame() {
    players = [];
    civilianWord = '';
    imposterWord = '';
    currentPlayerIndex = 0;
    numCivilians = 0;
    numImposters = 0;
    totalPlayers = 0;
    votingPhase = false;
  
    document.getElementById('game-settings').classList.remove('hidden');
    document.getElementById('player-setup').classList.add('hidden');
    document.getElementById('player-word').classList.add('hidden');
    document.getElementById('game-actions').classList.add('hidden');
    document.getElementById('player-list').classList.add('hidden');
  
    gameStatusElement.textContent = '';
    updatePlayerList();
  }


  document.getElementById('vote-out').addEventListener('click', () => {
    votingPhase = true;
    updatePlayerList();
  });


  function selectPlayerToVote(player) {
    if (votedPlayer === player) {
      votedPlayer = null;
      document.getElementById('confirm-vote').classList.add('hidden');
      document.getElementById('cancel-vote').classList.add('hidden');
    } else {
      votedPlayer = player;
      document.getElementById('confirm-vote').classList.remove('hidden');
      document.getElementById('cancel-vote').classList.remove('hidden');
    }
  }

  
  function assignRolesAndWords() {
    let roles = [];
    for (let i = 0; i < numCivilians; i++) roles.push('Civilian');
    for (let i = 0; i < numImposters; i++) roles.push('Imposter');
    for (let i = 0; i < numMrWhite; i++) roles.push('Mr. White');
  
    // Shuffle and assign roles
    shuffle(roles);
    players.forEach((player, index) => {
      player.role = roles[index];
      if (player.role === 'Mr. White') {
        player.word = 'You are Mr. White. No word assigned.';
      } else {
        // Assign word based on role as before
        player.word = (player.role === 'Civilian') ? civilianWord : imposterWord;
      }
    });
  }

function shuffleRoles(numCivilians, numImposters) {
    const roles = [];
    for (let i = 0; i < numCivilians; i++) {
      roles.push('Civilian');
    }
    for (let i = 0; i < numImposters; i++) {
      roles.push('Imposter');  }
    return shuffle(roles);
  }

  function shuffle(array) {
    const shuffledArray = [...array];
    for (let i = shuffledArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffledArray[i], shuffledArray[j]] = [shuffledArray[j], shuffledArray[i]];
    }
    return shuffledArray;
  }


  function showPlayerWord() {
    if (currentPlayerIndex < players.length) {
      const player = players[currentPlayerIndex];
      console.log(player);
      const currentPlayerElement = document.getElementById('current-player');
      const wordElement = document.getElementById('word');
      currentPlayerElement.textContent = player.name;
      wordElement.textContent = player.word;
      document.getElementById('player-setup').classList.add('hidden');
      document.getElementById('player-list').classList.add('hidden');
      document.getElementById('player-word').classList.remove('hidden');
    } else {
      document.getElementById('player-word').classList.add('hidden');
      if (players.length < totalPlayers) {
        document.getElementById('player-setup').classList.remove('hidden');
      } else {
        startGame();
      }
      document.getElementById('player-list').classList.remove('hidden');
      updatePlayerList();
    }
  }
  
 document.getElementById('next-player').addEventListener('click', () => {
  currentPlayerIndex++;
  showPlayerWord();
});

function startGame() {
  document.getElementById('player-setup').classList.add('hidden');
  document.getElementById('game-actions').classList.remove('hidden');
}
  
  // Hide the game actions initially
  document.getElementById('game-actions').classList.add('hidden');
  
  
  function checkGameStart() {
    if (numCivilians === 0 && numImposters === 0) {
      document.getElementById('player-setup').classList.add('hidden');
      document.getElementById('game-actions').classList.remove('hidden');
    }
  }
  
  function startDiscussion() {
    gameStatusElement.textContent = 'Discussion started. Players are describing their words.';
  }
  
  function voteOut() {
    gameStatusElement.textContent = 'Voting phase started. Players are voting someone out.';
    // Implement voting logic here
  }