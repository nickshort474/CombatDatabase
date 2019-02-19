import React, {Component} from 'react';
import {Route,Switch} from 'react-router-dom';

import Home from './pages/Home';


//business listing files
import BusinessPage from './pages/business/BusinessPage';
import AddBusiness from './pages/business/AddBusiness';
import FindBusiness from './pages/business/FindBusiness';
import SingleBusinessPage from './pages/business/SingleBusinessPage';
import ReviewPage from './pages/business/ReviewPage';
import EditBusiness from './pages/business/EditBusiness';
import AddBusinessImages from './pages/business/AddBusinessImages';
import EditBusinessLogo from './pages/business/EditBusinessLogo';

//people files
/*import Community from './pages/people/Community';
import SinglePersonPage from './pages/people/SinglePersonPage';
import FindPeople from './pages/people/FindPeople';
import ContactsList from './pages/people/ContactsList';
import NewMessage from './pages/people/NewMessage';
import NewCommunityMessage from './pages/people/NewCommunityMessage';
import NewPrivateMessage from './pages/people/NewPrivateMessage';
import MessageReply from './pages/people/MessageReply';
import FriendRequest from './pages/people/FriendRequest';*/


//events files
import EventsPage from './pages/events/EventsPage';
import FindEvents from './pages/events/FindEvents';
import AddEvents from './pages/events/AddEvents';
import SingleEventPage from './pages/events/SingleEventPage';
import EditEvent from './pages/events/EditEvent';
import EditEventLogo from './pages/events/EditEventLogo';

//styles files
import Styles from './pages/styles/Styles';
import AddStyle from './pages/styles/AddStyle';
import EditStyle from './pages/styles/EditStyle';
import EditHistory from './pages/styles/EditHistory';
import Report from './pages/styles/Report';

//forum files
/*import Forum from './pages/forum/Forum';
import ForumList from './pages/forum/ForumList';
import ForumSingle from './pages/forum/ForumSingle';
import AddThreadPage from './pages/forum/AddThreadPage';
*/


// Blog files 
import MyBlogList from './pages/blog/MyBlogList';
import MyBlogPostList from './pages/blog/MyBlogPostList';
import MySingleBlogPost from './pages/blog/MySingleBlogPost';
import ViewBlogs from './pages/blog/ViewBlogs';
import BlogPostList from './pages/blog/BlogPostList';
import SingleBlogPost from './pages/blog/SingleBlogPost';
import FindBlog from './pages/blog/FindBlog';
import AddBlog from './pages/blog/AddBlog';
import AddBlogPost from './pages/blog/AddBlogPost';
import SearchedBlogs from './pages/blog/SearchedBlogs';


//authorisation, profile, contact,other
import Contact from './pages/authOther/Contact';
import Response from './pages/authOther/Response';
import Privacy from './pages/authOther/Privacy';
import SignUp from './pages/authOther/SignUp';
import SignIn from './pages/authOther/SignIn';
import Profile from './pages/authOther/Profile';
import ProfilePic from './pages/authOther/ProfilePic';
import Username from './pages/authOther/Username';
import AboutUs from './pages/authOther/AboutUs';




export default class Routes extends Component{
	
	render(){
		return(
			<div className="content">
				<Switch>
					<Route exact path="/" component={Home} />
					<Route path="/Home" component={Home} />
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
					<Route path="/SignUp" component={SignUp} />
					<Route path="/SignIn" component={SignIn} />
					<Route path="/AboutUs" component={AboutUs} />
				</Switch>
			</div>
		)
	}
}