const dummy = () => {
  return 1
}

const totalLikes = (blogs) => {
  const reducer = (sum, item) => {
    return sum + item.likes
  }

  return blogs.length === 0
    ? 0
    : blogs.reduce(reducer, 0)
}

const favoriteBlog = (blogs) => {
  return blogs.length === 0
    ? 'No blogs listed'
    : blogs.find(blog => blog.likes === Math.max(...blogs.map(blog => blog.likes)))
}

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog
}