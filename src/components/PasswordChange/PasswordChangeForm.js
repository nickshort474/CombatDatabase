import React, {Component} from 'react';

import { withFirebase } from '../Firebase';

const INITIAL_STATE = {
	password1:"",
	password2:"",
	error:null
}

const PasswordChange = () => (
	<div>
		<PasswordChangeForm />
	</div>
)

class PasswordChangeFormBase extends Component{
	constructor(props){
		super(props);

		this.state = {
			...INITIAL_STATE
		};
	}

	_onSubmit(e){
		e.preventDefault();
		const { password1 } = this.state;
		this.props.firebase.doPasswordUpdate(password1).then(()=>{
			this.setState({
				...INITIAL_STATE
			})	
		}).catch((error)=>{
			this.setState({
				eroor:error
			})
		})
		
	}

	_onChange(e){
		this.setState({
			[e.target.id]:e.target.value
		})
	}

	render(){

		const isInvalid = this.state.password1 !== this.state.password2 || this.state.password1 === '';

		return(
			<form onSubmit={this._onSubmit.bind(this)}>
				<h4>Change password:</h4>
				<input type="password" placeholder="New password" value={this.state.password1} id="password1" onChange={this._onChange.bind(this)} /><br /><br />
				<input type="password" placeholder="Confirm new password" value={this.state.password2} id="password2" onChange={this._onChange.bind(this)} /><br /><br />
				<button disabled={isInvalid} className="btn btn-primary" type="submit">Change password</button>
				{this.state.error && <p>{this.state.error.message}</p>}
			</form>
		)
	}
}



const PasswordChangeForm = withFirebase(PasswordChangeFormBase);

export default PasswordChange;



