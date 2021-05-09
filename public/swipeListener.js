export default function createSwipeListener(command){

    const state = {
        observers: [],
        playerId: null,
        touch: [],
        offset: []
    }

    function subscribe(observerFunction) {
        state.observers.push(observerFunction);
    }

    function notifyAll(command){
        for(const observerFunction of state.observers){
            observerFunction(command);
        }
    }

    function registerPlayerId(playerId){
        state.playerId = playerId;
    }

    document.addEventListener('touchstart', touchStart);
    document.addEventListener('touchmove', touchMove);
    document.addEventListener('touchend', touchEnd);
    
    function touchStart(event){
        event.preventDefault();
        const touch = event.touches[0];

        state.touch = [touch.pageX, touch.pageY]
    }

    function touchMove(event){
        event.preventDefault();
        const touch = event.touches[0];

        state.offset = [touch.pageX - state.touch[0], touch.pageY - state.touch[1]];
    }

    function touchEnd(event){
        event.preventDefault();
        let keyPressed;

        if(Math.abs(state.offset[0]) > Math.abs(state.offset[1])){
            if(state.offset[0] / Math.abs(state.offset[0]) > 0){
                keyPressed = 'ArrowRight';
            } else {
                keyPressed = 'ArrowLeft';
            }
        } else {
            if(state.offset[1] / Math.abs(state.offset[1]) > 0){
                keyPressed = 'ArrowDown';
            } else {
                keyPressed = 'ArrowUp';
            }
        }

        const command = {
            type: 'move-player',
            playerId: state.playerId,
            keyPressed
        }

        notifyAll(command)

    }

    return {
        subscribe,
        registerPlayerId,

    }
}