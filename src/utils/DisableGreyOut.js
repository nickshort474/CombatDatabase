const _disable = () => {
	let elem = document.getElementsByClassName("content-wrapper")[0];
	elem.style.opacity = "0.5"

	let inputs = document.getElementsByTagName("input");
	for(let i = 0; i < inputs.length; i++){
		inputs[i].disabled = true;
		
	}
	let buttons = document.getElementsByTagName("button");
	for(let i = 0; i < buttons.length; i++){
		buttons[i].disabled = true;
		
	}

	
}

const _enable = () => {
	let elem = document.getElementsByClassName("content-wrapper")[0];
	elem.style.opacity = "1"

	let inputs = document.getElementsByTagName("input");
	for(let i = 0; i < inputs.length; i++){
		inputs[i].disabled = false;
		
	}

	let buttons = document.getElementsByTagName("button");
	for(let i = 0; i < buttons.length; i++){
		buttons[i].disabled = false;
		
	}
}

exports._disable = _disable;
exports._enable = _enable;  