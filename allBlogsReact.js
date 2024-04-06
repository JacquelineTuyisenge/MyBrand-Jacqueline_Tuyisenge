const { useEffect, useState } = React;

function AllBlogsReact() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  // run when page
  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch(
          "https://mybrand-be-ecx9.onrender.com/api/blogs"
        );
        const responseResult = await response.json();
        const blogsData = responseResult.data;

        setBlogs(blogsData);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [blogs]);
  
  if(loading){
    document.getElementById('loader').style.display = 'flex';
    return;
  } else {
    document.getElementById('loader').style.display = 'none';
  }

  return (
    <>
      {blogs.length > 0 ? (
        blogs.map((blog) => {
          return (
            <a href="blog-post-1.html" class="blog-card">
              <img src={blog.imageUrl} alt="Blog-image" />
              <h4>{blog.title}</h4>
              <div class="date-like-comments">
                <div class="date">
                  <p>{blog.createdAt.split("T")[0]}</p>
                </div>
                <div class="like">
                  <i class="bx bxs-heart"></i>
                  <p>{blog.blogLikes.length}</p>
                </div>
                <div class="comments">
                  <i class="bx bx-message-rounded-dots"></i>
                  <p>{blog.blogComments.length}</p>
                </div>
              </div>
            </a>
          );
        })
      ) : (
        <div>All Blogs</div>
      )}
    </>
  );
}
ReactDOM.render(<AllBlogsReact />, document.getElementById("blogsContainer"));
