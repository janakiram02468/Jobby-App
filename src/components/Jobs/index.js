import {Component} from 'react'
import Loader from 'react-loader-spinner'
import Cookies from 'js-cookie'
import {BsSearch} from 'react-icons/bs'

import {v4 as uuidv4} from 'uuid'

import UserProfile from '../UserProfile'
import JobCard from '../JobCard'
import Header from '../Header'

import './index.css'

const employmentTypesList = [
  {
    label: 'Full Time',
    employmentTypeId: 'FULLTIME',
  },
  {
    label: 'Part Time',
    employmentTypeId: 'PARTTIME',
  },
  {
    label: 'Freelance',
    employmentTypeId: 'FREELANCE',
  },
  {
    label: 'Internship',
    employmentTypeId: 'INTERNSHIP',
  },
]

const salaryRangesList = [
  {
    salaryRangeId: '1000000',
    label: '10 LPA and above',
  },
  {
    salaryRangeId: '2000000',
    label: '20 LPA and above',
  },
  {
    salaryRangeId: '3000000',
    label: '30 LPA and above',
  },
  {
    salaryRangeId: '4000000',
    label: '40 LPA and above',
  },
]

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'INPROGRESS',
}

class Jobs extends Component {
  state = {
    filterSearchInput: '',
    employTypeInput: [],
    salarayInput: '',
    userProfileDetails: {},
    jobsList: [],
    apiUserStatus: apiStatusConstants.initial,
    apiJobsStatus: apiStatusConstants.initial,
  }

  componentDidMount() {
    this.getUserProfile()
    this.getJobsList()
  }

  getUserProfile = async () => {
    this.setState({apiUserStatus: apiStatusConstants.inProgress})
    const jwtToken = Cookies.get('jwt_token')
    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }
    const profileUrl = 'https://apis.ccbp.in/profile'

    const response = await fetch(profileUrl, options)
    if (response.ok === true) {
      const data = await response.json()
      const updateUser = {
        id: uuidv4(),
        name: data.profile_details.name,
        profileImage: data.profile_details.profile_image_url,
        shortBio: data.profile_details.short_bio,
      }
      this.setState({
        userProfileDetails: updateUser,
        apiUserStatus: apiStatusConstants.success,
      })
    } else {
      this.setState({apiUserStatus: apiStatusConstants.failure})
    }
  }

  getjobCardDetailsList = eachJobCard => ({
    id: eachJobCard.id,
    jobDescription: eachJobCard.job_description,
    companyLogoUrl: eachJobCard.company_logo_url,
    employmentType: eachJobCard.employment_type,
    location: eachJobCard.location,
    rating: eachJobCard.rating,
    packagePerAnnum: eachJobCard.package_per_annum,
    title: eachJobCard.title,
  })

  getJobsList = async () => {
    const {filterSearchInput, employTypeInput, salarayInput} = this.state
    const employType = employTypeInput.join(',')
    this.setState({apiJobsStatus: apiStatusConstants.inProgress})
    const jwtToken = Cookies.get('jwt_token')
    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }
    let salary = ''
    if (salarayInput !== '') {
      salary = parseInt(salarayInput)
    }
    const jobsUrl = `https://apis.ccbp.in/jobs?employment_type=${employType}&minimum_package=${salary}&search=${filterSearchInput}`
    const response = await fetch(jobsUrl, options)
    if (response.ok === true) {
      const data = await response.json()
      const updateJobCard = data.jobs.map(eachJobCard =>
        this.getjobCardDetailsList(eachJobCard),
      )
      this.setState({
        jobsList: updateJobCard,
        apiJobsStatus: apiStatusConstants.success,
      })
    } else {
      this.setState({apiJobsStatus: apiStatusConstants.failure})
    }
  }

  isLoading = () => (
    <div className="loader-container" testid="loader">
      <Loader type="ThreeDots" color="#ffffff" height="50" width="50" />
    </div>
  )

  retryProfile = () => {
    this.getUserProfile()
  }

  showErrorProfile = () => (
    <button type="button" onClick={this.retryProfile}>
      Retry
    </button>
  )

  showUserProfile = () => {
    const {userProfileDetails} = this.state
    return (
      <UserProfile
        key={userProfileDetails.id}
        userProfileDetails={userProfileDetails}
      />
    )
  }

  onChangeSearchInput = event => {
    this.setState({filterSearchInput: event.target.value})
  }

  onClickSearchButton = () => {
    this.getJobsList()
  }

  onChangeEmploymentType = event => {
    const {employTypeInput} = this.state
    const isChecked = event.target.checked
    if (isChecked) {
      this.setState(
        {
          employTypeInput: [...employTypeInput, event.target.value],
        },
        this.getJobsList,
      )
    } else {
      const updatedEmploymentTypes = employTypeInput.filter(
        eachItem => eachItem !== event.target.value,
      )
      this.setState({employTypeInput: updatedEmploymentTypes}, this.getJobsList)
    }
  }

  onChangeSalaryRange = event => {
    this.setState({salarayInput: event.target.value}, this.getJobsList)
  }

  renderUserandFilterDetails = () => {
    const {filterSearchInput, employTypeInput, salarayInput} = this.state
    console.log(salarayInput)

    return (
      <div className="filter-user-container">
        <div className="filter-input-container-mobile">
          <input
            placeholder="Search"
            type="search"
            className="filter-input-mobile"
            onChange={this.onChangeSearchInput}
            value={filterSearchInput}
          />
          <button
            testid="searchButton"
            type="button"
            className="filter-search-button-mobile"
            onClick={this.onClickSearchButton}
          >
            <BsSearch className="search-icon" />
          </button>
        </div>
        {this.showUserProfile()}
        <hr className="hr-line" />
        <h1 className="employment-head">Type of Employment</h1>
        <ul className="employment-container">
          {employmentTypesList.map(eachType => (
            <li className="employment-list">
              <input
                value={eachType.employmentTypeId}
                id={eachType.employmentTypeId}
                type="checkbox"
                onChange={this.onChangeEmploymentType}
              />
              <label htmlFor={eachType.employmentTypeId}>
                {eachType.label}
              </label>
            </li>
          ))}
        </ul>
        <hr className="hr-line" />
        <h1 className="employment-head">Salary Range</h1>
        <ul className="employment-container">
          {salaryRangesList.map(eachSalary => (
            <li className="employment-list">
              <input
                value={eachSalary.salaryRangeId}
                id={eachSalary.salaryRangeId}
                type="radio"
                checked={salarayInput === eachSalary.salaryRangeId}
                onChange={this.onChangeSalaryRange}
              />
              <label htmlFor={eachSalary.salaryRangeId}>
                {eachSalary.label}
              </label>
            </li>
          ))}
        </ul>
      </div>
    )
  }

  showJobsList = () => {
    const {filterSearchInput, jobsList} = this.state
    const jobsListLength = jobsList.length
    return (
      <div className="similiar-job-details-container">
        <div className="filter-input-container-lg">
          <input
            placeholder="Search"
            type="search"
            className="filter-input-lg"
            onChange={this.onChangeSearchInput}
            value={filterSearchInput}
          />
          <button
            onClick={this.onClickSearchButton}
            type="button"
            className="filter-search-button-lg"
          >
            <BsSearch className="search-icon" />
          </button>
        </div>
        {jobsListLength > 0 ? (
          jobsList.map(eachJob => (
            <JobCard key={eachJob.id} jobCardDetails={eachJob} />
          ))
        ) : (
          <div className="no-jobs-container">
            <img
              className="no-job-image"
              alt="no jobs"
              src="https://assets.ccbp.in/frontend/react-js/no-jobs-img.png"
            />
            <h1 className="no-job-title">No Jobs Found</h1>
            <p>We could not find any jobs. Try other filters.</p>
          </div>
        )}
      </div>
    )
  }

  renderProfileUser = () => {
    const {apiUserStatus} = this.state
    switch (apiUserStatus) {
      case apiStatusConstants.success:
        return this.showUserProfile()
      case apiStatusConstants.failure:
        return this.showErrorProfile()
      case apiStatusConstants.inProgress:
        return this.isLoading()
      default:
        return null
    }
  }

  onClickRetryJobItem = () => {
    this.getJobsList()
  }

  showErrorJobsList = () => (
    <div className="failure-job-bg-container">
      <img
        className="failure-image"
        alt="failure view"
        src="https://assets.ccbp.in/frontend/react-js/failure-img.png"
      />
      <h1 className="failure-title">Oops! Something Went Wrong</h1>
      <p className="failure-description">
        We cannot seem to find the page you are looking for.
      </p>
      <button
        onClick={this.onClickRetryJobItem}
        className="retry-button"
        type="button"
      >
        Retry
      </button>
    </div>
  )

  renderJobsContainer = () => {
    const {apiJobsStatus} = this.state
    switch (apiJobsStatus) {
      case apiStatusConstants.success:
        return this.showJobsList()
      case apiStatusConstants.failure:
        return this.showErrorJobsList()
      case apiStatusConstants.inProgress:
        return this.isLoading()
      default:
        return null
    }
  }

  render() {
    return (
      <>
        <Header />
        <div className="filter-job-details-bg-container">
          <div className="filter-job-details-container">
            {this.renderUserandFilterDetails()}
            {this.renderJobsContainer()}
          </div>
        </div>
      </>
    )
  }
}

export default Jobs
