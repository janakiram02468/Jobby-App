import {Redirect} from 'react-router-dom'
import {Component} from 'react'
import Cookies from 'js-cookie'
import './index.css'

class LoginForm extends Component {
  state = {username: '', password: '', isApiFailure: false, errorMsg: ''}

  onChangeUsername = event => {
    this.setState({username: event.target.value})
  }

  onChangePassword = event => {
    this.setState({password: event.target.value})
  }

  onSubmitFailure = errorMsg => {
    this.setState({isApiFailure: true, errorMsg})
  }

  onSubmitSuccess = jwtToken => {
    const {history} = this.props
    Cookies.set('jwt_token', jwtToken, {expires: 30})
    history.replace('/')
  }

  onSubmitForm = async event => {
    event.preventDefault()
    const {username, password} = this.state

    const url = 'https://apis.ccbp.in/login'

    const userDetails = {username, password}
    const options = {
      method: 'POST',
      body: JSON.stringify(userDetails),
    }

    const response = await fetch(url, options)

    const data = await response.json()

    if (response.ok === true) {
      this.onSubmitSuccess(data.jwt_token)
    } else {
      this.onSubmitFailure(data.error_msg)
    }
  }

  render() {
    const {username, password, isApiFailure, errorMsg} = this.state

    const jwtToken = Cookies.get('jwt_token')
    if (jwtToken !== undefined) {
      return <Redirect to="/" />
    }

    return (
      <div className="bg-container">
        <form onSubmit={this.onSubmitForm} className="login-container">
          <img
            alt="website logo"
            className="jobby-log"
            src="https://assets.ccbp.in/frontend/react-js/logo-img.png"
          />
          <div className="input-container">
            <label htmlFor="username" className="label-name">
              USERNAME
            </label>
            <input
              id="username"
              className="user-input"
              placeholder="Username"
              type="text"
              onChange={this.onChangeUsername}
              value={username}
            />
          </div>
          <div className="input-container">
            <label htmlFor="password" className="label-name">
              PASSWORD
            </label>
            <input
              id="password"
              className="user-input"
              placeholder="Password"
              type="password"
              onChange={this.onChangePassword}
              value={password}
            />
          </div>
          <button type="submit" className="login-button">
            Login
          </button>
          {isApiFailure && <p className="error-msg">*{errorMsg}</p>}
        </form>
      </div>
    )
  }
}

export default LoginForm
