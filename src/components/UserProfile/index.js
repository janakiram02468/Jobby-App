import './index.css'

const UserProfile = props => {
  const {userProfileDetails} = props
  const {name, profileImage, shortBio} = userProfileDetails

  return (
    <div className="profile-container">
      <img alt="profile" src={profileImage} />
      <h1 className="profile-name">{name}</h1>
      <p>{shortBio}</p>
    </div>
  )
}
export default UserProfile
