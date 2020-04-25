import React, {Component} from 'react';

import Routes from './routes/Routes';
import {onError} from 'apollo-link-error';
import {ApolloProvider} from '@apollo/react-hooks';
import ApolloClient from 'apollo-boost';
import {ToastContainer, toast} from 'react-toastify';

import {library, dom} from '@fortawesome/fontawesome-svg-core';
import {fab} from '@fortawesome/free-brands-svg-icons';
import {fas} from '@fortawesome/free-solid-svg-icons';

import 'react-toastify/dist/ReactToastify.css';

import {USER_KEY} from './consts';

library.add(fab, fas);
dom.watch();

toast.configure({
  autoClose: 8000,
  draggable: false
  //etc you get the idea
});

const client = new ApolloClient({
  // uri: 'http://noul-server-1438625798.ap-southeast-1.elb.amazonaws.com:7070/',
  uri: 'http://localhost:7070',
  // Set Authorization header
  request: (operation) => {
    const user = localStorage.getItem(USER_KEY);
    if (user) {
      const token = JSON.parse(user)['accessToken'];
      operation.setContext({
        headers: {
          Authorization: token ? 'Nuol ' + token : '',
          Platform: 'ADMIN'
        }
      });
      return;
    }
    operation.setContext({
      headers: {
        Platform: 'ADMIN'
      }
    });
  },
  onError: (error) => {
    // //console.log('EEEE', error)
    if (
      error.response.errors[0].message ==
      'USER_WITH_THIS_USERID_IS_ALREADY_EXIST'
    ) {
      toast.error('ໄອດີນີ້ມີຢູ່ແລ້ວ ກະລຸນາປ້ອນໄອດີໃໝ່!', {autoClose: 5000});
    }
    if (
      error.response.errors[0].message ==
      'USER_WITH_THIS_PHONE_NUMBER_IS_ALREADY_EXIST'
    ) {
      toast.error('ເບີໂທນີ້ມີຢູ່ແລ້ວ ກະລຸນາປ້ອນເບີໂທໃໝ່!', {autoClose: 5000});
    }
    if (
      error.response.errors[0].message ==
      'USER_WITH_THIS_EMAIL_IS_ALREADY_EXIST'
    ) {
      toast.error('ອີເມວນີ້ມີຢູ່ແລ້ວ ກະລຸນາປ້ອນອີເມວໃໝ່!', {autoClose: 5000});
    }
  }
});

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <ApolloProvider client={client}>
        <Routes />
        <ToastContainer style={{zIndex: 10005}} autoClose={5000} />
      </ApolloProvider>
    );
  }
}

export default App;
