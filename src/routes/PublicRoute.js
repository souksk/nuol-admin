import React from 'react'
import {Route, Redirect} from 'react-router-dom'

// custom import
import {useAuth} from '../helpers/user'
// import Header from '../components/Header'

/**
 *
 * return not authenticated header & component
 */
function PublicRoute ({component: Component, headerTitle, ...rest}) {
  return (
    <Route
      {...rest}
      render={props => {
        return (
          <div>
            {/* <Header isAuthenticated={false} headerTitle={headerTitle} /> */}
            <Component {...props} />
          </div>
        )
      }}
    />
  )
}

export default PublicRoute
