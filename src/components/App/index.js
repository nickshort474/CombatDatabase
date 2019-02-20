import React from 'react';
import {BrowserRouter as Router,Route} from 'react-router-dom';

import Navigation from '../Navigation/Navigation';

import HomePage from '../Home/Home';


/*import AccountPage from '.../Account';
import AdminPage from '.../Admin';*/

//business listing files
import BusinessPage from '../business/BusinessPage';
import AddBusiness from '../business/AddBusiness';
import FindBusiness from '../business/FindBusiness';
import SingleBusinessPage from '../business/SingleBusinessPage';
import ReviewPage from '../business/ReviewPage';
import EditBusiness from '../business/EditBusiness';
import AddBusinessImages from '../business/AddBusinessImages';
import EditBusinessLogo from '../business/EditBusinessLogo';

//people files
/*import Community from '../people/Community';
import SinglePersonPage from '../people/SinglePersonPage';
import FindPeople from '../people/FindPeople';
import ContactsList from '../people/ContactsList';
import NewMessage from '../people/NewMessage';
import NewCommunityMessage from '../people/NewCommunityMessage';
import NewPrivateMessage from '../people/NewPrivateMessage';
import MessageReply from '../people/MessageReply';
import FriendRequest from '../people/FriendRequest';*/


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

//forum files
/*import Forum from '../forum/Forum';
import ForumList from '../forum/ForumList';
import ForumSingle from '../forum/ForumSingle';
import AddThreadPage from '../forum/AddThreadPage';
*/


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


//authorisation, profile, contact,other
import Contact from '../authOther/Contact';
import Response from '../authOther/Response';
import Privacy from '../authOther/Privacy';


import SignUpPage from '../SignUp/SignUp';
import SignInPage from '../SignIn/SignIn';
import PasswordForgetPage from '../PasswordForget/PasswordForget';


import Profile from '../authOther/Profile';
import ProfilePic from '../authOther/ProfilePic';
import Username from '../authOther/Username';
import AboutUs from '../authOther/AboutUs';


import {withAuthentication} from '../Session';



const App = () =>(
	
	
	<Router>
	 	<div>
		 	<Navigation />

		 	
		 	<Route exact path={"/"} component={HomePage} />
		 	<Route path ={"/Home"} component={HomePage} />
	     	
	      	<Route path={"/ForgotPassword"} component={PasswordForgetPage} />
	      	
			<Route path='/BusinessPage' component={BusinessPage} />
			<Route path="/Business/:BusinessKey" component={SingleBusinessPage} />	
			<Route path="/AddBusiness" component={AddBusiness} />
			<Route path="/FindBusiness" component={FindBusiness} />
			<Route path="/Review/:BusinessKey" component={ReviewPage} />
			<Route path="/EditBusiness/:BusinessKey" component={EditBusiness} />
			<Route path="/AddBusinessImages/:BusinessKey" component={AddBusinessImages} />
			<Route path="/EditBusinessLogo/:BusinessKey" component={EditBusinessLogo} />

			{/*
			<Route path="/Community" component={Community} />
			<Route path="/User/:UserKey" component={SinglePersonPage} />
			<Route path="/FindPeople" component={FindPeople} />
			<Route path="/ContactsList" component={ContactsList} />
			<Route path="/NewMessage" component={NewMessage} />
			<Route path="/NewCommunityMessage" component={NewCommunityMessage} />
			<Route path="/NewPrivateMessage/:MessageName/:MessageUID" component={NewPrivateMessage} />
			<Route path="/MessageReply/:MessageUser/:MessageID/:MessageType" component={MessageReply} />
			<Route path="/FriendRequest/:UserKey" component={FriendRequest} />*/}

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

export default withAuthentication(App);