const { useEffect, useState } = React;

function LatestBlogsReact() {
  const [blogs, setBlogs] = useState([]);

  useEffect(() => {
    async function fetchData() {
      try {
        // Show loader & popup when data fetching starts
        
        const loader = document.querySelector(".loader");
        loader.style.display = "flex";

        const response = await fetch(
          "https://mybrand-be-ecx9.onrender.com/api/blogs"
        );
        const responseResult = await response.json();
        const totalBlogs = responseResult.data.length;
        const blogsData = responseResult.data.slice(totalBlogs - 3, totalBlogs);

        setBlogs(blogsData);
        const popup = document.getElementById("popup");
        popup.innerText = responseResult.message;
        popup.classList.remove("hidden");
        setTimeout(() => {
          popup.classList.add("hidden");
        }, 5000);
      } catch (error) {
        console.log(error);
      } finally {
        // Hide loader and popup when data fetching completes
        const loader = document.querySelector(".loader");
        loader.style.display = "none";
      }
    }
    fetchData();
  }, []);

  return (
    <>
      {blogs.length > 0 ? (
        blogs.map((blog) => (
          <a href={`single-blog.html?id=${blog._id}`} className="blog-card" key={blog._id}>
            <img src={blog.imageUrl} alt="Blog-image" />
            <h4>{blog.title}</h4>
            <div className="date-like-comments">
              <div className="date">
                <p>{blog.createdAt.split("T")[0]}</p>
              </div>
              <div className="like">
                <i className="bx bxs-heart"></i>
                <p>{blog.blogLikes.length}</p>
              </div>
              <div className="comments">
                <i className="bx bx-message-rounded-dots"></i>
                <p>{blog.blogComments.length}</p>
              </div>
            </div>
          </a>
        ))
      ) : (
        <div>All Blogs</div>
      )}
    </>
  );
}

ReactDOM.render(<LatestBlogsReact />, document.getElementById("blogsContainer"));
