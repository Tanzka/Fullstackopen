import { useState } from 'react'
import PropTypes from 'prop-types'

const Blog = ({ blog, handleLike, handleRemove, currentUserId }) => {
  const [detailsVisible, setDetailsVisible] = useState(false)

  const toggleDetails = () => {
    setDetailsVisible(!detailsVisible)
  }


  const showDeleteButton = blog.user && String(blog.user.id) === String(currentUserId)

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }

  const minimalView = (
    <div>
      {blog.title} {blog.author}
      <button onClick={toggleDetails}>{ detailsVisible ? 'hide' : 'view' }</button>
    </div>
  )

  const detailedView = (
    <div>
      <div>URL: {blog.url}</div>
      <div>
        likes: {blog.likes}
        <button onClick={handleLike}>Like</button>
      </div>
      <div>
        <p>Author: {blog.user?.name || ''}</p>
      </div>
      <div>
        {showDeleteButton && (
          <button onClick={handleRemove}>
            Remove
          </button>
        )}
      </div>
    </div>
  )

  return (
    <div style={blogStyle} className='blog'>
      {minimalView}
      {detailsVisible && detailedView}
    </div>
  )
}

Blog.propTypes = {
  blog: PropTypes.shape({
    title: PropTypes.string.isRequired,
    author: PropTypes.string.isRequired,
    url: PropTypes.string,
    likes: PropTypes.number
  }).isRequired
}


export default Blog