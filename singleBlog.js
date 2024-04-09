const { useEffect, useState } = React;
function SingleBlog() {
  const [blogs, setBlogs] = useState({});
  const [loading, setLoading] = useState(true);
  const [comment, setComment] = useState();

  const urlParams = new URLSearchParams(window.location.search);
  const id = urlParams.get("id");

  useEffect(() => {
    async function fetchBlog() {
      try {
        const response = await fetch(
          `https://mybrand-be-ecx9.onrender.com/api/blogs/${id}`
        );

        const blogResponse = await response.json();
        setBlogs(blogResponse);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching blog", error);
        return null;
      }
    }

    fetchBlog();
  }, [blogs]);

  const token = localStorage.getItem("token");
  async function addComment() {
    try {
      if (!token) {
        popup.classNameList.remove("hidden");
        popup.innerText = "please sign in to comment on a blog";

        setTimeout(() => {
          popup.classNameList.add("hidden");
          window.location.href = "signin.html";
        }, 5000);
        return;
      }

      if (!comment) {
        popup.classNameList.remove("hidden");
        popup.innerText = "Comment cannot be empty";
        return;
      }

      const response = await fetch(
        `https://mybrand-be-ecx9.onrender.com/api/blogs/${id}/comments`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            comment: comment,
          }),
        }
      );

      if (!response.ok) {
        loader.style.display = "none";
        popup.classNameList.remove("hidden");
        popup.innerText = "please sign in to add a comment";

        setTimeout(() => {
          window.location.href = "signin.html";
        }, 3000);
        popup.classNameList.add("hidden");
        return;
      }

      const newCommentData = await response.json();
      loader.style.display = "none";
      popup.classNameList.remove("hidden");
      popup.innerText = newCommentData.message;
      console.log(newCommentData.message);

      setTimeout(() => {
        popup.classNameList.add("hidden");
      }, 5000);

      window.location.reload();
      console.log(newCommentData);

      const CommentContainer = document.querySelector(".comments");
      const commentEl = document.createElement("div");
      commentEl.classNameList.add("comment");
      commentEl.innerHTML = `
            <div className="profile-comment">
                <div>
                    <p id="comment-author">${newCommentData.author}</p>
                    <small>${newCommentData.comment}</small>
                    <br><br>
                </div>
            </div>
            <hr>
        `;
      CommentContainer.appendChild(commentEl);

      document.querySelector(".comment-place textarea").value = "";
    } catch (error) {
      console.error("Error adding comment", error);
      loader.style.display = "none";
      popup.classNameList.remove("hidden");
      popup.innerText = "Error adding comment";
      return null;
    }
  }

  async function toggleLike(icon) {
    try {
      const token = localStorage.getItem("token");
  
      if (!token) {
        popup.classNameList.remove("hidden");
        popup.innerText = "please sign in to like a blog";
  
        setTimeout(() => {
          popup.classNameList.add("hidden");
          window.location.href = "signin.html";
        }, 5000);
        return;
      }
  
      const response = await fetch(
        `https://mybrand-be-ecx9.onrender.com/api/blogs/${id}/likes`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
  
      if (!response.ok) {
        console.error("Error toggling like:", response.status);
        popup.classNameList.remove("hidden");
        popup.innerText = "Error toggling like";
        setTimeout(() => {
          popup.classNameList.add("hidden");
        }, 2000);
      }
  
      const data = await response.json();
      console.log("Response data:", data);
      popup.classNameList.remove("hidden");
      popup.innerText = data.message;
      setTimeout(() => {
        popup.classNameList.add("hidden");
      }, 5000);
  
      const likeCountElement = document.getElementById("like-count");
      if (!likeCountElement) {
        console.error("Like count element not found.");
        return;
      }
  
      const likedKey = `liked_${id}`;
      const isLiked = localStorage.getItem(likedKey);
  
      if (data.message === "Blog liked successfully") {
        icon.classList.add("liked");
        likeCountElement.textContent = parseInt(likeCountElement.textContent) + 1;
        // Store liked status locally
        localStorage.setItem(likedKey, true);
        console.log("Liked status stored:", localStorage.getItem(likedKey));
      } else if (data.message === "Blog unliked successfully") {
        icon.classList.remove("liked");
        likeCountElement.textContent = parseInt(likeCountElement.textContent) - 1;
        localStorage.removeItem(likedKey);
        console.log("Liked status removed:", localStorage.getItem(likedKey));
      }
    } catch (error) {
      console.error("Error liking/unliking blog", error.message);
    }
  }
  
  return (
    <>
      {loading ? (
        <span className="loader"></span>
      ) : (
        <div className="blog-card">
          <div className="blog-title">
            <h3>{blogs.title}</h3>
          </div>
          <div className="blog-authore-date">
            <div>
              <p>By: {blogs.author}</p>
            </div>
            <div>
              <p>{new Date(blogs.createdAt).toLocaleDateString()}</p>
            </div>
          </div>
          <div className="blog-image">
            <img src={blogs.imageUrl} alt={blogs.title} />
          </div>
          <div className="blog-content">
            <div dangerouslySetInnerHTML={{ __html: blogs.content }} />
          </div>
          <section className="comments">
            <div className="comment-like">
              <div className="comment-nbr">
                <p>{blogs.blogComments.length} comment(s)</p>
              </div>
              <div className="like-nbr">
                <p id="like-count">{blogs.blogLikes.length}</p>
                <i
                  className={`bx bxs-heart ${localStorage.getItem(`liked_${id}`) ? 'liked' : ''}`}
                  onClick={toggleLike}
                ></i>
                 {/* <i
            className={`bx bxs-heart ${isLiked ? 'liked' : ''}`}
            onClick={toggleLike} // Removed 'id' from arguments
          ></i> */}
              </div>
            </div>
            <div className="add-comment">
              <div className="comment-place">
                <textarea
                  onChange={(event) => setComment(event.target.value)}
                  type="text"
                  placeholder="Add a comment"
                  rows="1"
                  cols="40"
                ></textarea>
              </div>
              <div className="add-comment-btn">
                <button onClick={() => addComment(event)}>Add comment</button>
              </div>
            </div>
            {
              // Add comments section here
              blogs.blogComments.map((comment) => (
                <>
                  <div className="comment">
                    <div className="profile-comment">
                      <div>
                        <p id="comment-author">{comment.author}</p>
                        <small>{comment.comment}</small>
                        <br />
                      </div>
                    </div>
                  </div>
                  <hr />
                </>
              ))
            }
          </section>
        </div>
      )}
    </>
  );
}
ReactDOM.render(<SingleBlog />, document.querySelector(".blog"));

// // Fetch data for single blog post

// const loader = document.querySelector(".loader");
// const popup = document.getElementById("popup");

// async function fetchBlog(id) {
//   try {
//     loader.style.display = "block";

//     const response = await fetch(
//       `https://mybrand-be-ecx9.onrender.com/api/blogs/${id}`
//     );

//     if (!response.ok) {
//       loader.style.display = "none";
//       popup.classNameList.remove("hidden");
//       popup.innerText = "Error fetching blog";

//       setTimeout(() => {
//         popup.classNameList.add("hidden");
//       }, 5000);
//       throw new Error("Error fetching blogs");
//     }
//     const blog = await response.json();
//     loader.style.display = "none";
//     popup.classNameList.remove("hidden");
//     popup.innerText = "Blog fetched successfully";

//     setTimeout(() => {
//       popup.classNameList.add("hidden");
//     }, 5000);
//     return blog;
//   } catch (error) {
//     console.error("Error fetching blog", error);
//     return null;
//   }
// }

// // Function to create a blog card
// function createBlogCard(blog) {
//   const blogCard = document.createElement("div");
//   blogCard.classNameList.add("blog-card");

//   // Construct blog card HTML
// blogCard.innerHTML = `
//         <div className="blog-title">
//             <h3>${blog.title}</h3>
//         </div>
//         <div className="blog-authore-date">
//             <div>
//                 <p>By: ${blog.author}</p>
//             </div>
//             <div>
//                 <p>${new Date(blog.createdAt).toLocaleDateString()}</p>
//             </div>
//         </div>
//         <div className="blog-image">
//             <img src="${blog.imageUrl}" alt="${blog.title}">
//         </div>
//         <div className="blog-content">
//             ${blog.content}
//         </div>
//         <!-- Add comments section if needed -->
// <section className="comments">
//     <div className="comment-like">
//         <div className="comment-nbr">
//             <p>${blog.blogComments.length} comment(s)</p>
//         </div>
//         <div className="like-nbr">
//             <p id="like-count">${blog.blogLikes.length}</p>
//             <i className='bx bxs-heart ${
//               blog.isLiked ? "liked" : ""
//             }' onclick="toggleLike('${blog._id}', this)"></i>
//         </div>
//     </div>
//     <div className="add-comment">
//         <div className="comment-place">
//             <textarea type="text" placeholder="Add a comment" rows="1" cols="40"></textarea>
//         </div>
//         <div className="add-comment-btn">
//             <button onclick="addComment('${
//               blog._id
//             }')">Add comment</button>
//         </div>
//     </div>
//     ${
//       blog.blogComments && blog.blogComments.length > 0
//         ? blog.blogComments
//             .map(
//               (comment) => `
//         <div className="comment">
//             <div className="profile-comment">
//                 <div>
//                     <p id="comment-author">${comment.author}</p>
//                     <small>${comment.comment}</small>
//                     <br><br>
//                 </div>
//             </div>
//         </div>
//         <hr>
//     `
//             )
//             .join("")
//         : ""
//     }
//     <div className="see-comment-btn">
//         <button><a href="#">See all comments</a></button>
//     </div>
// </section>
//     `;
//   console.log(`the id of the blog is ${blog._id}`);
//   return blogCard;
// }

// // Function to populate the single blog page with data
// async function populateBlog(id) {
//   const urlParams = new URLSearchParams(window.location.search);
//   const blogId = urlParams.get("id");

//   if (!blogId) {
//     console.error("No blog ID provided");
//     return;
//   }

//   const blog = await fetchBlog(blogId);
//   if (!blog) {
//     console.error("Blog not found");
//     return;
//   }

//   // Clear existing content
//   document.querySelector(".blog").innerHTML = "";

//   // Clear existing comments
//   const commentsSection = document.querySelector(".comments");
//   commentsSection.innerHTML = "";
//   commentsSection.style.backgroundColor = "transparent";

//   // Create new blog card
//   const blogCard = createBlogCard(blog);

//   //check if blog is liked

//   const likeIcon = blogCard.querySelector(".bx.bxs-heart");
//   const likedKey = `liked_${blogId}`;
//   const isLiked = localStorage.getItem(likedKey);

//   if (isLiked) {
//     likeIcon.classNameList.add("liked");
//   }

//   // Append new blog card to the container
//   document.querySelector(".blog").appendChild(blogCard);
// }

//function to add a new comment
// const token = localStorage.getItem("token");
// async function addComment(blogId) {
//   loader.style.display = "block";
//   try {

//     if(!token){
//       popup.classNameList.remove("hidden");
//       popup.innerText = "please sign in to comment on a blog";

//       setTimeout(() => {
//         popup.classNameList.add("hidden");
//         window.location.href = "signin.html";
//       }, 5000);
//       return;
//     }
//     const commentContent = document
//       .querySelector(".comment-place textarea")
//       .value.trim();

//     if (!commentContent) {
//       popup.classNameList.remove("hidden");
//       popup.innerText = "Comment cannot be empty";
//       return;
//     }

//     const response = await fetch(
//       `https://mybrand-be-ecx9.onrender.com/api/blogs/${blogId}/comments`,
//       {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${token}`,
//         },
//         body: JSON.stringify({
//           comment: commentContent,
//         }),
//       }
//     );

//     if (!response.ok) {
//       loader.style.display = "none";
//       popup.classNameList.remove("hidden");
//       popup.innerText = "please sign in to add a comment";

//       setTimeout(() => {
//         window.location.href = "signin.html";
//       }, 3000);
//       popup.classNameList.add("hidden");
//       return;
//     }

//     const newCommentData = await response.json();
//     loader.style.display = "none";
//     popup.classNameList.remove("hidden");
//     popup.innerText = newCommentData.message;
//     console.log(newCommentData.message);

//     setTimeout(() => {
//       popup.classNameList.add("hidden");
//     }, 5000);

//     window.location.reload();
//     console.log(newCommentData);

//     const CommentContainer = document.querySelector(".comments");
//     const commentEl = document.createElement("div");
//     commentEl.classNameList.add("comment");
//     commentEl.innerHTML = `
//             <div className="profile-comment">
//                 <div>
//                     <p id="comment-author">${newCommentData.author}</p>
//                     <small>${newCommentData.comment}</small>
//                     <br><br>
//                 </div>
//             </div>
//             <hr>
//         `;
//     CommentContainer.appendChild(commentEl);

//     document.querySelector(".comment-place textarea").value = "";

//     //update comment count

//     const commentCountElement = document.querySelector(".comment-nbr p");
//     const currentCommentCount = parseInt(commentCountElement.textContent);
//     commentCountElement.textContent = currentCommentCount + 1;
//   } catch (error) {
//     console.log(error);
//     loader.style.display = "none";
//     popup.classNameList.remove("hidden");
//     popup.innerText = "Error adding comment";
//     return;
//   }
// }

// //funtion to toggle like

// async function toggleLike(blogId, icon) {
//   try {
//     const token = localStorage.getItem("token");

//     if(!token){
//       popup.classNameList.remove("hidden");
//       popup.innerText = "please sign in to like a blog";

//       setTimeout(() => {
//         popup.classNameList.add("hidden");
//         window.location.href = "signin.html";
//       }, 5000);
//       return;
//     }

//     const response = await fetch(
//       `https://mybrand-be-ecx9.onrender.com/api/blogs/${blogId}/likes`,
//       {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${token}`,
//         },
//       }
//     );

//     if (!response.ok) {
//       console.error("Error toggling like:", response.status);
//       popup.classNameList.remove("hidden");
//       popup.innerText = "Error toggling like";
//       setTimeout(() => {
//         popup.classNameList.add("hidden");
//       }, 2000);
//     }

//     const data = await response.json();
//     console.log("Response data:", data);
//     popup.classNameList.remove("hidden");
//     popup.innerText = data.message;
//     setTimeout(() => {
//       popup.classNameList.add("hidden");
//     }, 5000);

//     const likeCountElement = document.getElementById("like-count");
//     if (!likeCountElement) {
//       console.error("Like count element not found.");
//       return;
//     }

//     const likedKey = `liked_${blogId}`;
//     if (data.message === "Blog liked successfully") {
//       icon.classNameList.add("liked");
//       likeCountElement.textContent = parseInt(likeCountElement.textContent) + 1;
//       // Store liked status locally
//       localStorage.setItem(likedKey, true);
//       console.log("Liked status stored:", localStorage.getItem(likedKey));
//     } else if (data.message === "Blog unliked successfully") {
//       icon.classNameList.remove("liked");
//       likeCountElement.textContent = parseInt(likeCountElement.textContent) - 1;
//       localStorage.removeItem(likedKey);
//       console.log("Liked status removed:", localStorage.getItem(likedKey));
//     }
//   } catch (error) {
//     console.error("Error liking/unliking blog", error.message);
//   }
// }

// // Event listener for DOMContentLoaded event
// document.addEventListener("DOMContentLoaded", function () {
// const urlParams = new URLSearchParams(window.location.search);
// const blogId = urlParams.get("id");
// populateBlog(blogId);
// });
