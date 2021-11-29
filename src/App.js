import {Route, Switch, Redirect} from 'react-router-dom'
import LoginForm from './components/LoginForm'
import JobItemDetails from './components/JobItemDetails'
import Home from './components/Home'
import NotFound from './components/NotFound'
import Jobs from './components/Jobs'

import ProtectedRoute from './components/ProtectedRoute'

import './App.css'

// Replace your code here
const App = () => (
  <Switch>
    <Route exact path="/login" component={LoginForm} />
    <ProtectedRoute exact path="/" component={Home} />
    <ProtectedRoute exact path="/jobs" component={Jobs} />
    <ProtectedRoute exact path="/jobs/:id" component={JobItemDetails} />
    <Route component={NotFound} />
  </Switch>
)

export default App
