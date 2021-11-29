import {Component} from 'react'
import Loader from 'react-loader-spinner'
import Cookies from 'js-cookie'

import {AiFillStar} from 'react-icons/ai'
import {MdLocationOn} from 'react-icons/md'
import {BsFillBriefcaseFill} from 'react-icons/bs'
import {HiExternalLink} from 'react-icons/hi'

import SimiliarJob from '../SimiliarJob'
import Header from '../Header'

import './index.css'

const apiStatusContants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'Failure',
  inProgress: 'INPROGRESS',
}

class JobItemDetails extends Component {
  state = {
    apiStatus: apiStatusContants.initial,
    jobItemDetailsList: {},
    similiarJobsList: [],
  }

  componentDidMount = () => {
    this.getJobItemDetails()
  }

  getjobItemDetailsList = jobDetails => ({
    id: jobDetails.id,
    jobDescription: jobDetails.job_description,
    companyWebsiteUrl: jobDetails.company_website_url,
    companyLogoUrl: jobDetails.company_logo_url,
    employmentType: jobDetails.employment_type,
    skillsList: jobDetails.skills,
    lifeAtCompany: jobDetails.life_at_company,
    location: jobDetails.location,
    rating: jobDetails.rating,
    packagePerAnnum: jobDetails.package_per_annum,
    title: jobDetails.title,
  })

  getSimiliarJobsList = eachSimiliarJob => ({
    id: eachSimiliarJob.id,
    title: eachSimiliarJob.title,
    companyLogoUrl: eachSimiliarJob.company_logo_url,
    jobDescription: eachSimiliarJob.job_description,
    employmentType: eachSimiliarJob.employment_type,
    location: eachSimiliarJob.location,
    rating: eachSimiliarJob.rating,
  })

  getJobItemDetails = async () => {
    this.setState({apiStatus: apiStatusContants.inProgress})
    const {match} = this.props
    const {params} = match
    const {id} = params

    const jwtToken = Cookies.get('jwt_token')
    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }

    const jobUrl = `https://apis.ccbp.in/jobs/${id}`

    const response = await fetch(jobUrl, options)
    const data = await response.json()
    if (response.ok === true) {
      const jobDetails = this.getjobItemDetailsList(data.job_details)
      console.log(data)
      const updateSimiliarJobs = await data.similar_jobs.map(eachSimiliarJob =>
        this.getSimiliarJobsList(eachSimiliarJob),
      )
      this.setState({
        apiStatus: apiStatusContants.success,
        jobItemDetailsList: jobDetails,
        similiarJobsList: [...updateSimiliarJobs],
      })
    } else {
      this.setState({apiStatus: apiStatusContants.failure})
    }
  }

  renderLoader = () => (
    <>
      <div className="loader-container" testid="loader">
        <Loader type="ThreeDots" color="#ffffff" height="50" width="50" />
      </div>
    </>
  )

  onClickRetryJobItem = () => {
    this.getJobItemDetails()
  }

  renderFailureDetails = () => (
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

  renderJobDetails = () => {
    const {jobItemDetailsList, similiarJobsList} = this.state

    const {
      jobDescription,
      companyWebsiteUrl,
      companyLogoUrl,
      employmentType,
      skillsList,
      lifeAtCompany,
      location,
      rating,
      packagePerAnnum,
      title,
    } = jobItemDetailsList

    return (
      <div className="job-similiar-details-container">
        <div className="job-details-container">
          <div className="job-details">
            <div className="company-title-container">
              <img
                alt="job details company logo"
                className="company-icon"
                src={companyLogoUrl}
              />
              <div className="job-title-container">
                <h1 className="job-title">{title}</h1>
                <div className="rating-container">
                  <AiFillStar className="rating-icon" />
                  <p className="rating">{rating}</p>
                </div>
              </div>
            </div>
            <div className="job-place-information">
              <ul className="job-place-container">
                <li className="place-internship">
                  <MdLocationOn className="location-job-icon" />
                  <p className="rating">{location}</p>
                </li>
                <li className="place-internship">
                  <BsFillBriefcaseFill className="location-job-icon" />
                  <p className="rating">{employmentType}</p>
                </li>
              </ul>
              <p className="package">{packagePerAnnum}</p>
            </div>
            <hr className="hr-line" />
            <div className="description-container">
              <div className="description-link">
                <h1>Description</h1>
                <a href={companyWebsiteUrl} className="web-link">
                  Visit <HiExternalLink className="web-link-icon" />
                </a>
              </div>
              <p>{jobDescription}</p>
            </div>
            <div className="skills-container">
              <h1>Skills</h1>
              <ul className="skills-list">
                {skillsList.map(eachSkils => (
                  <li className="skill" key={eachSkils.name}>
                    <img
                      alt={eachSkils.name}
                      className="skill-icon"
                      src={eachSkils.image_url}
                    />
                    <p>{eachSkils.name}</p>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h1 className="lift-at-company">Life at Company</h1>
              <div className="company-description-image">
                <p>{lifeAtCompany.description}</p>
                <img alt="life at company" src={lifeAtCompany.image_url} />
              </div>
            </div>
          </div>
        </div>
        <h1 className="similiar-jobs-title">Similar Jobs</h1>
        <ul className="similiar-job-details-container">
          {similiarJobsList.map(eachSimiliarJob => (
            <SimiliarJob
              key={eachSimiliarJob.id}
              similiarJobsDetails={eachSimiliarJob}
            />
          ))}
        </ul>
      </div>
    )
  }

  renderJobItemDetails = () => {
    const {apiStatus} = this.state
    switch (apiStatus) {
      case apiStatusContants.success:
        return this.renderJobDetails()
      case apiStatusContants.failure:
        return this.renderFailureDetails()
      case apiStatusContants.inProgress:
        return this.renderLoader()
      default:
        return null
    }
  }

  render() {
    return (
      <>
        <Header />
        <div className="job-details-bg-container">
          {this.renderJobItemDetails()}
        </div>
      </>
    )
  }
}

export default JobItemDetails
