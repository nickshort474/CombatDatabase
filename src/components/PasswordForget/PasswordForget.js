import React, { Component } from 'react';
import { Link } from 'react-router-dom';

import { withFirebase } from '../Firebase';


const PasswordForgetPage = () => (
    <div>
        <PasswordForgetForm />
    </div>
);

const INITIAL_STATE = {
    email: '',
    error: null,
};

class PasswordForgetFormBase extends Component {
    
    constructor(props) {
        super(props);

        this.state = {
            ...INITIAL_STATE 
        };

    }

    _onSubmit(e){
        e.preventDefault();
       
        let email = this.state.email;

        this.props.firebase.doPasswordReset(email).then(() => {

            this.setState({
                ...INITIAL_STATE 
            });

            this.props.history.push('/Sign in')

        }).catch(error => {

            this.setState({ error });

        });

      
    };

    _onChange(e){
        this.setState({ 
            [e.target.name]: e.target.value 
        });
    };


    render() {
        let { email, error } = this.state;

        let isInvalid = email === '';

        return (
            <div className="container">
                <div className="content-wrapper">
                    <div className="box text-center greyedContent">
                        <h2>Forgotten your password?</h2>
                        
                        <form onSubmit={this._onSubmit.bind(this)}>
                            <input name="email" value={this.state.email} onChange={this._onChange.bind(this)} type="text" placeholder="Email Address" /><br /><br />
                            <button disabled={isInvalid} className="btn btn-primary" type="submit">Send email reset</button>

                            {error && <p>{error.message}</p>}
                        </form>
                    </div>
                </div>
            </div>

           
        );
    }
}

const PasswordForgetLink = () => (
     
    <div className="box greyedContent">
        <Link to={'/ForgotPassword'}>Forgot Password?</Link>
    </div>
                
   
);

const PasswordForgetForm = withFirebase(PasswordForgetFormBase);

export default PasswordForgetPage;
export { PasswordForgetLink };