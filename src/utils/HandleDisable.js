const _handleDisable = () =>{
	// Disable buttons and grey out display
	let elem = document.getElementsByClassName("content-wrapper")[0];
	elem.style.opacity = "0.5";

	let inputs = document.getElementsByTagName("INPUT");
	
	for(let i = 0; i < inputs.length; i++){
		inputs[i].disabled = true;
	}
	let buttons = document.getElementsByTagName("BUTTON");
	
	for(let i = 0; i < buttons.length; i++){
		buttons[i].disabled = true;
	}

}

exports._handleDisable = _handleDisable;