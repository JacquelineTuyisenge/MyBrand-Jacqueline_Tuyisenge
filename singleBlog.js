// singleBlog.js

document.addEventListener('DOMContentLoaded', function () {
    // Fetch the blog title from the URL
    const urlParams = new URLSearchParams(window.location.search);
    const blogTitle = urlParams.get('title');

    console.log('Requested Blog Title:', blogTitle); // line for debugging

    // Use the blog title to find the corresponding blog post
    const myBlogArray = JSON.parse(localStorage.getItem('myBlogs')) || [];

    console.log('All Blogs:', myBlogArray); //  line for debugging

    const singleBlog = myBlogArray.find(blog => blog.blogTitle === blogTitle);

    if (singleBlog) {
        // Generate HTML for the single blog post
        const singleBlogContainer = document.getElementById('singleBlogContainer');
        singleBlogContainer.innerHTML = `
            <div class="blog-title">
                <h3>${singleBlog.blogTitle}</h3>
            </div>
            <div class="blog-authore-date">
                <div>
                    <p>By: Jacqeline T.</p>
                </div>
                <div>
                    <p>${singleBlog.blogDate}</p>
                </div>
            </div>
            <div class="blog-image">
                <img src="${singleBlog.blogImage}" alt="${singleBlog.blogTitle}">
            </div>
            <div class="blog-content">
                <h4></h4>
                ${singleBlog.blogDescription}
            </div>
        `;

        // retrieve and display comments

        const storedComments = JSON.parse(localStorage.getItem('comments')) || [];
        const commentSection = document.getElementById('commentsSection');

        storedComments.forEach(comment => {
            const commentElement = document.createElement('div');
            commentElement.classList.add('comment');
            commentElement.innerHTML = `
                <div class="profile-comment">
                    <div>
                        <img src="images/jacky.svg" alt="commenter-profile">
                    </div>
                    <div>
                        <p>${comment.commenter}</p>
                        <p>${comment.text}</p>
                    </div>
                </div>
                <div class="comment-like-reply">
                    <p>0</p>
                    <i class='bx bxs-heart'></i>
                    <p>Reply</p>
                    <i class='bx bx-down-arrow-alt' ></i>
                </div>
                <div class="reply">
                    <p>Asante Pia</p>
                </div>
            `;
            commentSection.appendChild(commentElement);
        });


    } else {
        // Handle the case where the blog post is not found
        console.error('Blog post not found');
    }
});

// function to handle comments in

function addComment() {
    // form validation
    let errorMessage = document.getElementById('error');
    let commentText = document.getElementById('commentText').value;

    if (commentText === "") {
        errorMessage.textContent = "Comment cannot be empty";
    } else if (commentText.length < 5) {
        errorMessage.textContent = "Comment must be at least 5 characters";
    } else {
        errorMessage.textContent = "";
        console.log(commentText);

        // creating new comment element
        const newComment = document.createElement('div');
        newComment.classList.add('comment');

        // comment html
        newComment.innerHTML = `
            <div class="profile-comment">
                <div>
                    <img src="images/jacky.svg" alt="commenter-profile">
                </div>
                <div>
                    <p>Amie</p>
                    <p>${commentText}</p>
                </div>
            </div>
            <div class="comment-like-reply">
                <p>0</p>
                <i class='bx bxs-heart'></i>
                <p>Reply</p>
                <i class='bx bx-down-arrow-alt' ></i>
            </div>
            <div class="reply">
                <p>Asante Pia</p>
            </div>
        `;

        // Append the new comment after the 'add-comment' element
        const commentSection = document.getElementById('commentsSection');
        commentSection.insertBefore(newComment, commentSection.children[2]);

        // clear the comment text
        document.getElementById('commentText').value = "";

        // store the comments in local storage
        const storedComments = JSON.parse(localStorage.getItem('comments')) || [];
        storedComments.unshift({ commenter: 'Amie', text: commentText }); // Add the new comment to the beginning
        localStorage.setItem('comments', JSON.stringify(storedComments));
    }
}

