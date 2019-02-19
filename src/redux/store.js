import {createStore} from 'redux';
import reducer from './reducer';

const saveState = (state) => {
	try{
		const serialisedState = JSON.stringify(state);

		window.sessionStorage.setItem('appState',serialisedState);
	}catch(err){

	}
}

const loadState = () => {
	try{
		const serialisedState = window.sessionStorage.getItem("appState");

		if(!serialisedState){
			return undefined;
		}
		return JSON.parse(serialisedState);
	}catch(err){
		return undefined;
	}
}

const oldState = loadState();
const store = createStore(reducer, oldState);

store.subscribe(()=>{
	saveState(store.getState());
});

export default store;