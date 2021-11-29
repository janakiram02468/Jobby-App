import {Link} from 'react-router-dom'
import {AiFillStar} from 'react-icons/ai'
import {MdLocationOn} from 'react-icons/md'
import {BsFillBriefcaseFill} from 'react-icons/bs'

import './index.css'

const JobCard = props => {
  const {jobCardDetails} = props
  const {
    id,
    jobDescription,
    companyLogoUrl,
    employmentType,
    location,
    rating,
    packagePerAnnum,
    title,
  } = jobCardDetails

  return (
    <div className="jobcard-details-container">
      <Link to={`/jobs/${id}`} className="job-link">
        <div className="jobcard-details">
          <div className="company-title-container">
            <img
              alt="company logo"
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
            <h1>Description</h1>
            <p>{jobDescription}</p>
          </div>
        </div>
      </Link>
    </div>
  )
}

export default JobCard
