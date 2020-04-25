import React from 'react'
import {Route, Redirect} from 'react-router-dom'

// custom import
import {useAuth} from '../helpers/user'
// import Header from '../components/Header'

/**
 *
 * return authenticated header & component
 */
function PrivateRoute ({component: Component, headerTitle, ...rest}) {
  const isAuthenticated = useAuth()

  // if not authenticated, redirect to "/"
  return (
    <Route
      {...rest}
      render={props =>
        isAuthenticated
          ? <div>
            {/* <Header isAuthenticated headerTitle={headerTitle} /> */}
            <Component {...props} />
          </div>
          : <Redirect to='/' />}
    />
  )
}

export default PrivateRoute
