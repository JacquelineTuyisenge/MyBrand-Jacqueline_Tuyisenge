// Fetch data for single blog post

const loader = document.querySelector(".loader");
const popup = document.getElementById("popup");

async function fetchBlog(id) {
  try {
    loader.style.display = "block";

    const response = await fetch(
      `https://mybrand-be-ecx9.onrender.com/api/blogs/${id}`
    );

    if (!response.ok) {
      loader.style.display = "none";
      popup.classList.remove("hidden");
      popup.innerText = "Error fetching blog";

      setTimeout(() => {
        popup.classList.add("hidden");
      }, 5000);
      throw new Error("Error fetching blogs");
    }
    const blog = await response.json();
    loader.style.display = "none";
    popup.classList.remove("hidden");
    popup.innerText = "Blog fetched successfully";

    setTimeout(() => {
      popup.classList.add("hidden");
    }, 5000);
    return blog;
  } catch (error) {
    console.error("Error fetching blog", error);
    return null;
  }
}

// Function to create a blog card
function createBlogCard(blog) {
  const blogCard = document.createElement("div");
  blogCard.classList.add("blog-card");

  // Construct blog card HTML
  blogCard.innerHTML = `
        <div class="blog-title">
            <h3>${blog.title}</h3>
        </div>
        <div class="blog-authore-date">
            <div>
                <p>By: ${blog.author}</p>
            </div>
            <div>
                <p>${new Date(blog.createdAt).toLocaleDateString()}</p>
            </div>
        </div>
        <div class="blog-image">
            <img src="${blog.imageUrl}" alt="${blog.title}">
        </div>
        <div class="blog-content">
            ${blog.content}
        </div>
        <!-- Add comments section if needed -->
        <section class="comments">
            <div class="comment-like">
                <div class="comment-nbr">
                    <p>${blog.blogComments.length} comment(s)</p>
                </div>
                <div class="like-nbr">
                    <p id="like-count">${blog.blogLikes.length}</p>
                    <i class='bx bxs-heart ${
                      blog.isLiked ? "liked" : ""
                    }' onclick="toggleLike('${blog._id}', this)"></i>
                </div>
            </div>
            <div class="add-comment">
                <div class="comment-place">
                    <textarea type="text" placeholder="Add a comment" rows="1" cols="40"></textarea>
                </div>
                <div class="add-comment-btn">
                    <button onclick="addComment('${
                      blog._id
                    }')">Add comment</button>
                </div>
            </div>
            ${
              blog.blogComments && blog.blogComments.length > 0
                ? blog.blogComments
                    .map(
                      (comment) => `
                <div class="comment">
                    <div class="profile-comment">
                        <div>
                            <p id="comment-author">${comment.author}</p>
                            <small>${comment.comment}</small>
                            <br><br>
                        </div>
                    </div>
                </div>
                <hr>
            `
                    )
                    .join("")
                : ""
            }
            <div class="see-comment-btn">
                <button><a href="#">See all comments</a></button>
            </div>
        </section>
    `;
  console.log(`the id of the blog is ${blog._id}`);
  return blogCard;
}

// Function to populate the single blog page with data
async function populateBlog(id) {
  const urlParams = new URLSearchParams(window.location.search);
  const blogId = urlParams.get("id");

  if (!blogId) {
    console.error("No blog ID provided");
    return;
  }

  const blog = await fetchBlog(blogId);
  if (!blog) {
    console.error("Blog not found");
    return;
  }

  // Clear existing content
  document.querySelector(".blog").innerHTML = "";

  // Clear existing comments
  const commentsSection = document.querySelector(".comments");
  commentsSection.innerHTML = "";
  commentsSection.style.backgroundColor = "transparent";

  // Create new blog card
  const blogCard = createBlogCard(blog);

  //check if blog is liked

  const likeIcon = blogCard.querySelector(".bx.bxs-heart");
  const likedKey = `liked_${blogId}`;
  const isLiked = localStorage.getItem(likedKey);

  if (isLiked) {
    likeIcon.classList.add("liked");
  }

  // Append new blog card to the container
  document.querySelector(".blog").appendChild(blogCard);
}

// function to add a new comment
const token = localStorage.getItem("token");
async function addComment(blogId) {
  loader.style.display = "block";
  try {
    const commentContent = document
      .querySelector(".comment-place textarea")
      .value.trim();

    if (!commentContent) {
      popup.classList.remove("hidden");
      popup.innerText = "Comment cannot be empty";
      return;
    }

    const response = await fetch(
      `https://mybrand-be-ecx9.onrender.com/api/blogs/${blogId}/comments`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          comment: commentContent,
        }),
      }
    );

    if (!response.ok) {
      loader.style.display = "none";
      popup.classList.remove("hidden");
      popup.innerText = "please sign in to add a comment";

      setTimeout(() => {
        window.location.href = "signin.html";
      }, 3000);
      popup.classList.add("hidden");
      return;
    }

    const newCommentData = await response.json();
    loader.style.display = "none";
    popup.classList.remove("hidden");
    popup.innerText = newCommentData.message;
    console.log(newCommentData.message);

    setTimeout(() => {
      popup.classList.add("hidden");
    }, 5000);

    window.location.reload();
    console.log(newCommentData);

    const CommentContainer = document.querySelector(".comments");
    const commentEl = document.createElement("div");
    commentEl.classList.add("comment");
    commentEl.innerHTML = `
            <div class="profile-comment">
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

    //update comment count

    const commentCountElement = document.querySelector(".comment-nbr p");
    const currentCommentCount = parseInt(commentCountElement.textContent);
    commentCountElement.textContent = currentCommentCount + 1;
  } catch (error) {
    console.log(error);
    loader.style.display = "none";
    popup.classList.remove("hidden");
    popup.innerText = "Error adding comment";
    return;
  }
}

//funtion to toggle like

async function toggleLike(blogId, icon) {
  try {
    const token = localStorage.getItem("token");

    if(!token){
      popup.classList.remove("hidden");
      popup.innerText = "please sign in to like a blog";
      window.location.href = "signin.html";
      return;
    }

    const response = await fetch(
      `https://mybrand-be-ecx9.onrender.com/api/blogs/${blogId}/likes`,
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
      popup.classList.remove("hidden");
      popup.innerText = "Error toggling like";
      setTimeout(() => {
        popup.classList.add("hidden");
      }, 2000);
    }

    const data = await response.json();
    console.log("Response data:", data);
    popup.classList.remove("hidden");
    popup.innerText = data.message;
    setTimeout(() => {
      popup.classList.add("hidden");
    }, 5000);

    const likeCountElement = document.getElementById("like-count");
    if (!likeCountElement) {
      console.error("Like count element not found.");
      return;
    }

    const likedKey = `liked_${blogId}`;
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

// Event listener for DOMContentLoaded event
document.addEventListener("DOMContentLoaded", function () {
  const urlParams = new URLSearchParams(window.location.search);
  const blogId = urlParams.get("id");
  populateBlog(blogId);
});
