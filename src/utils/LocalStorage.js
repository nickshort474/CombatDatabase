

const saveState = (state) => {
	try{
		const serialisedState = JSON.stringify(state);

		window.localStorage.setItem('appState',serialisedState);
	}catch(err){

	}
}

const loadState = () => {
	try{
		const serialisedState = window.localStorage.getItem("appState");

		if(!serialisedState){
			return undefined;
		}
		return JSON.parse(serialisedState);
	}catch(err){
		return undefined;
	}
}

exports.saveState = saveState;
exports.loadState = loadState;