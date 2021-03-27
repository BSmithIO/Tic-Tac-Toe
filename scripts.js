const DomElements = (() => {
    const cells = document.querySelectorAll(".cell");
    const reset = document.querySelector(".reset");
    const displayText = document.querySelector(".displaytext");
    const startBtn = document.querySelector(".startbutton")
    const game = document.querySelector(".game");
    const startGame = document.querySelector(".startgame");
    const player1 = document.querySelector("#player1");
    const player2 = document.querySelector("#player2");
    return {cells, reset, displayText, startBtn, game, startGame, player1, player2 };
})();

const Player = (name, mark) => {
    const player = {};
    player.name = name;
    player.mark = mark;
    player.score = 0;

    return player;
}


const Game = ( () => {

    let player1, player2;
    let nextPlayerIndex = 0;

    const start = () => {
        const player_1 = (DomElements.player1.value) ? DomElements.player1.value : "Player 1";
        const player_2 = (DomElements.player2.value) ? DomElements.player2.value : "Player 2";

        player1 = Player(player_1, 'X');
        player2 = Player(player_2, 'O');
    }

    const currentPlayer = () => {
        const player = [player1, player2][nextPlayerIndex];
        return player;
    }

    const nextPlayer = () => {
        if (nextPlayerIndex == 0) {
            nextPlayerIndex = 1;
        } else {
            nextPlayerIndex = 0;
        }
    }

    const checkForWinner = () => {
        const currPlayer = currentPlayer();
        const playerMark = currPlayer.mark;

        const winConditions = [
            [1, 2, 3],
            [4, 5, 6],
            [7, 8, 9],
            [1, 4, 7],
            [2, 5, 8],
            [3, 6, 9],
            [1, 5, 9],
            [3, 5, 7],
        ];

        const testArray = [];

        Gameboard.board.forEach((item, index) => {
            if (item == playerMark) {
                testArray.push(index + 1);
            }
        });

        for (let i = 0; i < winConditions.length; i++) {
            const formula = winConditions[i];
            let result = formula.every((item) => testArray.includes(item));

            if (result) {
                return result;
            }
        }

        console.log(testArray)

    }
    const checkTie = () => {
        if (Gameboard.board.includes("")) {
            return false;
        } else {
            return true;
        }
    }

    const isGameOver = () => {
        const currPlayer = currentPlayer();
        const playerName = currPlayer.name;
        if (checkForWinner()) {
            DomElements.displayText.innerText = `${playerName} wins!`;
            currPlayer.score += 1;
            return true;
        } else if (checkTie()) {
            DomElements.displayText.innerText = `Tie!`;
            return true;
        }
    }

    const resetIndex = () => {
        nextPlayerIndex = 0;
    }

    return {isGameOver, currentPlayer, nextPlayer, start, checkForWinner, resetIndex};
})();


const Gameboard = (() => {

    let board = ["","","","","","","","",""];

    const markBoard = (e) => {
        const currPlayer = Game.currentPlayer();
        const playerMark = currPlayer.mark;
        const playerName = currPlayer.name;

        if (board[e.target.id] != "" && !Game.isGameOver()) {
            return false;
        } else if (!Game.isGameOver()) {
            board[e.target.id] = playerMark;
            DisplayController.displayBoard();
            Game.isGameOver();
            if (!Game.checkForWinner()) {
                Game.nextPlayer();
            }
        }

    }

    const reset = () => {
        for (let i = 0; i < board.length; i++) {
            DomElements.cells[i].innerText = "";
            board[i] = "";
        };
        Game.resetIndex();
        DomElements.displayText.innerText = "";
    }


    return {markBoard, reset, board};
})();


const DisplayController = (() => {

    const displayBoard = (name) => {
        for (let i = 0; i < Gameboard.board.length; i++) {
            DomElements.cells[i].innerText = Gameboard.board[i];
        };
    }

    const start = (name) => {
        DomElements.startGame.style.display = "none";
        DomElements.game.style.display = "flex";
        Game.start();
    }

    return {displayBoard, start};
})();



const CreateEvents = (() => {
    const cellEvents = () => { for (let i = 0; i < DomElements.cells.length; i++) {
        DomElements.cells[i].id = i;
        DomElements.cells[i].addEventListener("click", Gameboard.markBoard);
    } }

    const resetEvent = () => {
        DomElements.reset.addEventListener("click", Gameboard.reset);
    }

    const startButton = () => {
        DomElements.startBtn.addEventListener("click", DisplayController.start)
    }

    cellEvents();
    resetEvent();
    startButton();
})();

