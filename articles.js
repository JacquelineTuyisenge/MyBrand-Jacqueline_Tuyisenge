// // Declare blogList in the global scope
// let blogList;

// Form validation
function validateForm(event) {
    event.preventDefault();

    let title = document.getElementById('title').value;
    let description = document.getElementById('myTextarea').value;
    let image = document.getElementById('imageInput').value;

    const errorMessage = "Title or Description cannot be empty!";

    if (title === "" && description === "") {
        document.getElementById('error').textContent = errorMessage;
        return;
    }
}

// addblog
const formData = document.getElementById('articleForm');

formData.addEventListener('submit', function (event) {
    event.preventDefault();
    const image = document.getElementById('image').files[0];
    const title = document.getElementById('title').value;
    const date = document.getElementById('date').value;
    const description = tinymce.get('myTextarea').getContent({format:'text'});

       // Set default values for likes and comments
       const defaultLikes = 0;
       const defaultComments = 0;

    const myBlogArray = JSON.parse(localStorage.getItem('myBlogs')) || [];
    const reader = new FileReader();
    reader.onload = () => {
        const articleImage = reader.result;
        const articleContents = {
            blogImage: articleImage,
            blogTitle: title,
            blogDate: date,
            blogLike: 0,
            blogComments: 0,
            blogDescription: description
        };        
        myBlogArray.unshift(articleContents);
        localStorage.setItem('myBlogs', JSON.stringify(myBlogArray));
        window.location.href='blog-cards.html';
    }
    reader.readAsDataURL(image);
})