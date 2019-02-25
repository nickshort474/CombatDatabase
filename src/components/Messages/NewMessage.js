import React, {Component} from 'react';
import {firebase} from '@firebase/app';



import LocalStorage from '../../utils/LocalStorage';


class NewMessage extends Component{
	
	constructor(props){
		super(props);
		
		this.user = LocalStorage.loadState("user");
		this.firestore = firebase.firestore();

		// setup initial state
		this.state = {
			content:"",
			items:[]
			
		}
			
	}
	
	componentWillMount() {
		window.scrollTo(0, 0);
			
	}

	_handleInput(e){
		
		this.setState({
			[e.target.id]:e.target.value
		})

	}

	_handlePost(e){
		e.preventDefault();
		
		// collect data
		
		let content = e.target.content.value;
		
		if(content.length > 1){
			
			// set ref for user in Messages section
			let ref = this.firestore.collection("Messages").doc(this.user).collection(this.props.msgUser);

			// get rid of 1 old message to keep message store at 10
			ref.get().then((snapshot)=>{
				
				if(snapshot.size === 11){
					let query = ref.orderBy("messageDate", "asc").limit(1);
					query.get().then((snapshot)=>{
						
						snapshot.forEach((snap)=>{
							
							this.firestore.collection("Messages").doc(this.user).collection(this.props.msgUser).doc(snap.id).delete();
						})
					})
				}
			})


			//get date time
			let now = Date.now();
			
			// create object data
			let obj = {
				
				messageContents:content,
				messageDate:now,
				messageUser:this.user,
				
			}
			//add message data to Messages section in firestore
			ref.add(obj).then(()=>{

				// set ref for user in Messages section
				let ref2 = this.firestore.collection("Messages").doc(this.props.msgUser).collection(this.user);

				//get date time
				let now = Date.now();
				
				// create object data
				let obj2 = {
					
					messageContents:content,
					messageDate:now,
					messageUser:this.user,
					
				}
				//add message data to Messages section in firestore
				ref2.add(obj2).then(()=>{
										
				})
			})
		}else{
			alert("Please fill in some content")
		}
	}

	


	render(){
		return(
			<form onSubmit={this._handlePost.bind(this)} action="">	
				<div className="row box text-center">
					<div className="col-sm-9">
							<textarea id="content" value={this.state.content} placeholder="content" onChange={this._handleInput.bind(this)} />
						</div>

						<button type="submit" value="Post message" className="btn btn-primary extraMargin">Submit</button>
				</div>
			</form>	
		)
	}
}

export default NewMessage;