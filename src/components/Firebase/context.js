import React from 'react';

const FirebaseContext = React.createContext(null);

//set up firebase context
export const withFirebase = Component => props => (
  <FirebaseContext.Consumer>
    {firebase => <Component {...props} firebase={firebase} />}
  </FirebaseContext.Consumer>
);


export default FirebaseContext;