

const saveState = (name,state) => {
	try{
		const serialisedState = JSON.stringify(state);

		window.localStorage.setItem(name,serialisedState);
	}catch(err){

	}
}

const loadState = (name) => {
	try{
		const serialisedState = window.localStorage.getItem(name);

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