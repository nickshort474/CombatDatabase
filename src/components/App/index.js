import React, {Component} from 'react';
import {BrowserRouter as Router,Route} from 'react-router-dom';


import Navigation from '../Navigation/Navigation';
import HomePage from '../Home/Home';

//Business listing files
import Business from '../Business/Business';
import AddBusiness from '../Business/AddBusiness';
import FindBusiness from '../Business/FindBusiness';
import SingleBusinessPage from '../Business/SingleBusinessPage';
import ReviewPage from '../Business/ReviewPage';
import EditBusiness from '../Business/EditBusiness';
import AddBusinessImages from '../Business/AddBusinessImages';
import EditBusinessLogo from '../Business/EditBusinessLogo';

import Community from '../Community/Community';
import Person from '../Community/Person';
import FindPeople from '../Community/FindPeople';
import ContactsList from '../Community/ContactsList';
import ContactRequest from '../Community/ContactRequest';
import SearchForPeople from '../Community/SearchForPeople';


import NewMessage from '../Messages/NewMessage';

//events files
import EventsPage from '../events/EventsPage';
import FindEvents from '../events/FindEvents';
import AddEvents from '../events/AddEvents';
import SingleEventPage from '../events/SingleEventPage';
import EditEvent from '../events/EditEvent';
import EditEventLogo from '../events/EditEventLogo';

//styles files
import Styles from '../styles/Styles';
import AddStyle from '../styles/AddStyle';
import EditStyle from '../styles/EditStyle';
import EditHistory from '../styles/EditHistory';
import Report from '../styles/Report';


// Blog files 
import MyBlogList from '../blog/MyBlogList';
import MyBlogPostList from '../blog/MyBlogPostList';
import MySingleBlogPost from '../blog/MySingleBlogPost';
import ViewBlogs from '../blog/ViewBlogs';
import BlogPostList from '../blog/BlogPostList';
import SingleBlogPost from '../blog/SingleBlogPost';
import FindBlog from '../blog/FindBlog';
import AddBlog from '../blog/AddBlog';
import AddBlogPost from '../blog/AddBlogPost';
import SearchedBlogs from '../blog/SearchedBlogs';


//authorisation, profile, contact, other
import Contact from '../AuthOther/Contact';
import Response from '../AuthOther/Response';
import Privacy from '../AuthOther/Privacy';
import AboutUs from '../AuthOther/AboutUs';


import SignUpPage from '../SignUp/SignUp';
import SignInPage from '../SignIn/SignIn';
import PasswordForgetPage from '../PasswordForget/PasswordForget';


import Profile from '../Profile/Profile';
import ProfilePic from '../Profile/ProfilePic';
import Username from '../Profile/Username';




import {withAuthentication} from '../Session';



class App extends Component{

	
	render(){
		return(
			<Router>
				 	<div>
					 	<Navigation />

					 	
					 	<Route exact path={"/"} component={HomePage} />
					 	<Route path ={"/Home"} component={HomePage} />
				     	
				      	<Route path={"/ForgotPassword"} component={PasswordForgetPage} />
				      	
						<Route path='/Business' component={Business} />
						<Route path="/SingleBusiness/:BusinessKey" component={SingleBusinessPage} />	
						<Route path="/AddBusiness" component={AddBusiness} />
						<Route path="/FindBusiness" component={FindBusiness} />
						<Route path="/Review/:BusinessKey" component={ReviewPage} />
						<Route path="/EditBusiness/:BusinessKey" component={EditBusiness} />
						<Route path="/AddBusinessImages/:BusinessKey" component={AddBusinessImages} />
						<Route path="/EditBusinessLogo/:BusinessKey" component={EditBusinessLogo} />

						
						<Route path="/Community" component={Community} />
						<Route path="/Person/:PersonKey" component={Person} />
						<Route path="/FindPeople" component={FindPeople} />
						<Route path="/ContactsList" component={ContactsList} />
						<Route path="/ContactRequest/:PersonKey" component={ContactRequest} />
						<Route path="/NewMessage/:Username/:UserUID" component={NewMessage} />
						<Route path="/SearchForPeople" component={SearchForPeople} />
						{/*
						<Route path="/NewCommunityMessage" component={NewCommunityMessage} />
						<Route path="/NewPrivateMessage/:MessageName/:MessageUID" component={NewPrivateMessage} />
						<Route path="/MessageReply/:MessageUser/:MessageID/:MessageType" component={MessageReply} />
						*/}

						<Route path="/Events" component={EventsPage} />
						<Route path="/SingleEvent/:EventKey" component={SingleEventPage} />
						<Route path="/FindEvents" component={FindEvents} />
						<Route path="/AddEvents" component={AddEvents} />
						<Route path="/EditEvent/:EventKey" component={EditEvent} />
						<Route path="/EditEventLogo/:EventKey" component={EditEventLogo} />

						<Route path="/Styles" component={Styles} />
						<Route path="/AddStyle" component={AddStyle} />
						<Route path="/EditStyle/:Category/:Style" component={EditStyle} />
						<Route path="/EditHistory/:HistoryKey" component={EditHistory} />
						<Route path="/Report" component={Report} />

						{/*<Route path="Forum" component={Forum} />
						<Route path="ForumList/:Name" component={ForumList} />
						<Route path="ForumSingle/:topicCat/:topicId" component={ForumSingle} />
						<Route path="AddThreadPage" component={AddThreadPage} />
						*/}

						<Route path="/MyBlogList" component={MyBlogList} />
						<Route path="/MyBlogPostList/:BlogUser/:BlogName" component={MyBlogPostList} />
						<Route path="/MySingleBlogPost/:BlogUser/:BlogName/:PostKey" component={MySingleBlogPost} />
						<Route path="/ViewBlogs" component={ViewBlogs} />
						<Route path="/BlogPostList/:BlogUser/:BlogName" component={BlogPostList} />
						<Route path="/SingleBlogPost/:BlogUser/:BlogName/:PostKey" component={SingleBlogPost} />
						<Route path="/AddBlogPost/:BlogName" component={AddBlogPost} />
						<Route path="/FindBlog" component={FindBlog} />
						<Route path="/AddBlog" component={AddBlog} />
						<Route path="/SearchedBlogs/:SearchTerm" component={SearchedBlogs} />

						<Route path="/Contact" component={Contact} />
						<Route path="/Response" component={Response} />
						<Route path="/Privacy" component={Privacy} />
						<Route path="/Profile" component={Profile} />
						<Route path="/ProfilePic/:UserRef" component={ProfilePic} />
						<Route path="/Username" component={Username} />
						

						<Route path="/AboutUs" component={AboutUs} />

						<Route path="/SignUp" component={SignUpPage} />
						<Route path="/Signin" component={SignInPage} />
					</div>		
			 	</Router>
		)
	}
	
}

export default withAuthentication(App);