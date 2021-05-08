export default function createGame() {

    const state = {
        players: {},
        fruits: {},
        screen: {
            width:10,
            height:10,
        }
    }

    const observers = []

    function subscribe(observerFunction) {
        observers.push(observerFunction);
    }

    function notifyAll(command){
        for(const observerFunction of observers){
            observerFunction(command);
        }
    }


    function setState(newState){
        Object.assign(state,newState)
    }

    function addFruit(command){
        const fruitId = command.fruitId;
        const fruitX = command.fruitX;
        const fruitY = command.fruitY;

        state.fruits[fruitId] = {
            x: fruitX, y: fruitY
        }
    }

    function removeFruit(command){
        const fruitId = command.fruitId;

        delete state.fruits[fruitId];
    }

    function addPlayer(command){
        const playerId = command.playerId;
        const playerX = 'playerX' in command ? command.playerX : Math.floor(Math.random() * state.screen.width);
        const playerY = 'playerY' in command ? command.playerY : Math.floor(Math.random() * state.screen.height);

        state.players[playerId] = {
            x: playerX, y: playerY
        }

        notifyAll({
            type: 'add-player',
            playerId: playerId,
            playerX: playerX,
            playerY: playerY
        })
    }

    function removePlayer(command){
        const playerId = command.playerId;

        delete state.players[playerId];

        notifyAll({
            type:'remove-player',
            playerId,
        })
    }

    function checkForFruitCollision(playerId){
        const player = state.players[playerId];

        for (const fruitId in state.fruits){
            const fruit = state.fruits[fruitId];

            if(player.x === fruit.x && player.y === fruit.y){
                removeFruit({fruitId});
            }
        }
    }

    function movePlayer(command){
        notifyAll(command)

        const acceptedMoves = {
            ArrowUp(player){
                player.y = Math.max(player.y - 1, 0);
                return;
            },
            ArrowDown(player){
                player.y = Math.min(player.y + 1, state.screen.height-1);
                return;
            },
            ArrowLeft(player){
                player.x = Math.max(player.x - 1, 0);
                return;
            },
            ArrowRight(player){
                player.x = Math.min(player.x + 1, state.screen.width-1);
                return;
            }
        }

        const key = command.keyPressed;
        const player = state.players[command.playerId];
        const playerId = command.playerId;
        const moveFunction = acceptedMoves[key];
        if(player && moveFunction){
            moveFunction(player);
            checkForFruitCollision(playerId);
        }
    }

    return {
        state,
        subscribe,
        addFruit,
        setState,
        removeFruit,
        addPlayer,
        removePlayer,
        movePlayer
    }
}