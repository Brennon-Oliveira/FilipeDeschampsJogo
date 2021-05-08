export default function createGame() {

    const state = {
        players: {},
        fruits: {},
        screen: {
            width:10,
            height:10,
        }
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
        const playerX = command.playerX;
        const playerY = command.playerY;

        state.players[playerId] = {
            x: playerX, y: playerY
        }
    }

    function removePlayer(command){
        const playerId = command.playerId;

        delete state.players[playerId];
    }

    function checkForFruitCollision(playerId){
        const player = state.players[playerId];

        for (const fruitId in state.fruits){
            const fruit = state.fruits[fruitId];

            if(player.x === fruit.x && player.y === fruit.y){
                console.log(`Collision between ${playerId} and ${fruitId}`)
                removeFruit({fruitId});
            }
        }
    }

    function movePlayer(command){
        console.log(`movePlayer() --> Moving ${command.playerId} with ${command.keyPressed}`);

        const acceptedMoves = {
            ArrowUp(player){
                console.log('movePlayer().ArrowUp() --> Moving player Up');
                player.y = Math.max(player.y - 1, 0);
                return;
            },
            ArrowDown(player){
                console.log('movePlayer().ArrowDown() --> Moving player Down');
                player.y = Math.min(player.y + 1, state.screen.height-1);
                return;
            },
            ArrowLeft(player){
                console.log('movePlayer().ArrowLeft() --> Moving player Left');
                player.x = Math.max(player.x - 1, 0);
                return;
            },
            ArrowRight(player){
                console.log('movePlayer().ArrowRight() --> Moving player Right');
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
        addFruit,
        removeFruit,
        addPlayer,
        removePlayer,
        movePlayer
    }
}