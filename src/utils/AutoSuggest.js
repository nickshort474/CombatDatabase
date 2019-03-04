import React, {Component} from 'react';
import Autosuggest from 'react-autosuggest';

import store from '../redux/store';
import constants from '../redux/constants';

export default class AutoSuggest extends Component{
	
	constructor(props){
		super(props);
		
		this.state = {
			value:"",
			suggestions:[]
		}
		this.page = this.props.page;
	}


	getSuggestions(value){

		const inputValue = value.trim().toLowerCase();
		const inputLength = inputValue.length;

		if(this.props.page === "searchForBlog"){
			return inputLength === 0 ? [] : this.props.list.filter(lang => lang.word.toLowerCase().slice(0,inputLength) === inputValue);
		}else if(this.props.page === "searchForPeople"){
			return inputLength === 0 ? [] : this.props.list.filter(lang => lang.toLowerCase().slice(0,inputLength) === inputValue);
		}
		
		
		/*return inputLength === 0 ? [] : this.props.list.filter(lang => lang.word.toLowerCase().slice(0,inputLength) === inputValue);*/
		/*if(testReturn.length > 0){
			this.props.handler(testReturn);
		}*/
		
	}

	getSuggestionValue(suggestion){
		console.log(suggestion);
		console.log(this.page)
		if(this.page === "searchForBlog"){

			store.dispatch({type:constants.SAVE_BLOG_SEARCH_TERM, blogSearchTerm:suggestion.word})
			return suggestion.word;
		}else if(this.page === "searchForPeople"){
			console.log("returning suggestion");
			store.dispatch({type:constants.SAVE_PEOPLE_SEARCH_TERM, peopleSearchTerm:suggestion})
			
			return suggestion;
		}
		
		
	}

	renderSuggestion(suggestion){
		
		if(this.page === "searchForBlog"){
			return  <div><p className="noList">{suggestion.word}</p></div>
		}else if(this.page === "searchForPeople"){
			return  <div><p className="noList">{suggestion}</p></div>
		}
		
	};

	onChange = (event,{newValue}) => {
		
		this.setState({
			value:newValue
		});
		
	};


	onSuggestionsFetchRequested = ({value}) => {
		this.setState({
			suggestions:this.getSuggestions(value)
		});
	};

	onSuggestionsClearRequested = () => {
		this.setState({
			suggestions:[]
		});
	};



	render(){

		const { value, suggestions } = this.state;
		
		const inputProps = {
      		placeholder: 'Type a keyword to search for',
      		value,
      		onChange: this.onChange
    	};


		return(
			<div className="msgCompStyle">
				<Autosuggest
			        suggestions={suggestions}
			        onSuggestionsFetchRequested={this.onSuggestionsFetchRequested}
			        onSuggestionsClearRequested={this.onSuggestionsClearRequested}
			        getSuggestionValue={this.getSuggestionValue.bind(this)}
			        renderSuggestion={this.renderSuggestion.bind(this)}
			        inputProps={inputProps}
			     />
		     </div>
		)
	}
}