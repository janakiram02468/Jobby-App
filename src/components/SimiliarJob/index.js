import {Link} from 'react-router-dom'

import {AiFillStar} from 'react-icons/ai'
import {MdLocationOn} from 'react-icons/md'
import {BsFillBriefcaseFill} from 'react-icons/bs'

import './index.css'

const SimiliarJob = props => {
  const {similiarJobsDetails} = props

  const {
    id,
    title,
    companyLogoUrl,
    jobDescription,
    employmentType,
    location,
    rating,
  } = similiarJobsDetails

  return (
    <li className="similiar-job-details">
      <Link to={`/jobs/${id}`} className="similiar-job-link">
        <div className="company-title-container">
          <img
            alt="similar job company logo"
            className="company-icon"
            src={companyLogoUrl}
          />
          <div className="similiar-job-title-container">
            <h1 className="similiar-job-title">{title}</h1>
            <div className="similiar-rating-container">
              <AiFillStar className="rating-icon" />
              <p className="rating">{rating}</p>
            </div>
          </div>
        </div>
        <h1 className="similiar-description-title">Description</h1>
        <p className="similiar-job-description">{jobDescription}</p>
        <ul className="similiar-job-place-container">
          <li className="similiar-place-internship">
            <MdLocationOn className="location-job-icon" />
            <p className="rating">{location}</p>
          </li>
          <li className="similiar-place-internship">
            <BsFillBriefcaseFill className="location-job-icon" />
            <p className="rating">{employmentType}</p>
          </li>
        </ul>
      </Link>
    </li>
  )
}
export default SimiliarJob
