import React, {Component} from 'react';
import Autosuggest from 'react-autosuggest';

import store from '../redux/store';
import constants from '../redux/constants';

export default class AutoSuggest extends Component{
	
	constructor(){
		super();
		this.state = {
			value:"",
			suggestions:[]
		}
	}


	getSuggestions(value){

		const inputValue = value.trim().toLowerCase();
		const inputLength = inputValue.length;

		//send inputLength back to parent for error checking
		
		let testReturn = inputLength === 0 ? [] : this.props.list.filter(lang => lang.word.toLowerCase().slice(0,inputLength) === inputValue);
		/*return inputLength === 0 ? [] : this.props.list.filter(lang => lang.word.toLowerCase().slice(0,inputLength) === inputValue);*/
		if(testReturn.length > 0){
			this.props.handler(testReturn);
		}
		return testReturn;
	}

	getSuggestionValue(suggestion){
		
		store.dispatch({type:constants.SAVE_BLOG_SEARCH_TERM, blogSearchTerm:suggestion.word})
		
		return suggestion.word;
	}

	renderSuggestion(suggestion){
		return <div>
			<p className="noList">{suggestion.word}</p>
		</div>
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
			        getSuggestionValue={this.getSuggestionValue}
			        renderSuggestion={this.renderSuggestion}
			        inputProps={inputProps}
			     />
		     </div>
		)
	}
}