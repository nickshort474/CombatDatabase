import React from 'react';
import { Link } from 'react-router-dom';

import SignOutButton from '../SignOut';
import * as ROUTES from '../../constants/routes';


import { AuthUserContext } from '../Session';


const Navigation = () => (
  <div>
    <AuthUserContext.Consumer>
      {authUser =>
        authUser ? <NavigationAuth /> : <NavigationNonAuth />
      }
    </AuthUserContext.Consumer>
  </div>
);



const NavigationAuth = () => (
  <div>
      <Link to={ROUTES.LANDING} className="btn btn-inverse signinBtn"  data-toggle="collapse" data-target=".navbar-collapse">Landing</Link>
   
      <Link to={ROUTES.HOME} className="btn btn-inverse signinBtn"  data-toggle="collapse" data-target=".navbar-collapse">Home</Link>
   
      <Link to={ROUTES.ACCOUNT} className="btn btn-primary signinBtn"  data-toggle="collapse" data-target=".navbar-collapse">Account</Link>
   
      <SignOutButton />
   </div>
);

const NavigationNonAuth = () => (
 <div>
    <Link to={ROUTES.LANDING} className="btn btn-inverse signinBtn"  data-toggle="collapse" data-target=".navbar-collapse">Landing</Link>
    
    <Link to={ROUTES.SIGN_IN} className="btn btn-primary"  data-toggle="collapse" data-target=".navbar-collapse">Sign In</Link>
 
  </div>
);


const HeaderNavigation = () => (
	
	<header className="navbar navbar-default navbar-fixed-top">
    	<div className="container">
            <div className="navbar-header">
            	<Link to="/" className="navbar-brand visible-xs">CombatDB </Link>
                <button type="button" className="navbar-toggle collapsed" data-toggle="collapse" data-target=".navbar-collapse"  aria-expanded="false"><i className="fa fa-bars"></i></button>
            </div>

            <div className="collapse navbar-collapse" >
            	<ul className="nav navbar-nav">
                	
                	<li><Link to="/" data-target=".navbar-collapse">Home</Link></li>
                	<li><Link to="/BusinessPage" data-target=".navbar-collapse">Business</Link></li>
                    <li><Link to="/Events" data-target=".navbar-collapse">Events</Link></li>
                    <li><Link to="/Styles" data-target=".navbar-collapse">Styles</Link></li>
					<li><Link to="/ViewBlogs" data-target=".navbar-collapse">Blogs</Link></li>
				
                </ul>
                <div className="pull-right navbar-buttons">
                	
                	
                    <Navigation />
                   
                </div>
            </div>
        </div>
    </header>

)

export default HeaderNavigation;