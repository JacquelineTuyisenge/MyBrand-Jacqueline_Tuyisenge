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
            blogImage : articleImage,
            blogTitle : title,
            blogDate : date,
            blogLike: 0,
            blogComments: 0,
            blogDescription : description
        }
        myBlogArray.unshift(articleContents);
        localStorage.setItem('myBlogs', JSON.stringify(myBlogArray));
        window.location.href='blog-cards.html';
    }
    reader.readAsDataURL(image);
})























// // Function to convert image into base64
// function convertImageToBase64(imagePath, callback) {
//     const img = new Image();
//     img.crossOrigin = 'Anonymous';

//     img.onload = function () {
//         const canvas = document.createElement('canvas');
//         canvas.width = img.width;
//         canvas.height = img.height;

//         const context = canvas.getContext('2d');
//         context.drawImage(img, 0, 0, img.width, img.height);

//         const base64Image = canvas.toDataURL('image/png');
//         callback(base64Image);
//     };

//     img.src = imagePath;
// }

// // Function to update the blog table
// function updateBlogTable() {
//     let blogTableBody = document.getElementById("blogTableBody");

//     // Check if blogTableBody exists before attempting to use it
//     if (blogTableBody) {
//         // Clearing the table rows
//         blogTableBody.innerHTML = "";

//         // Looping through the blog list and adding each blog to the table
//         blogList.forEach(function (blog, index) {
//             let blogRow = document.createElement("tr");
//             blogRow.innerHTML = `
//                 <td><img src="${blog.image}" alt="Sample Image" class="message-image"></td>
//                 <td class="message-title">${blog.title}</td>
//                 <td class="message-description">${blog.description}</td>
//                 <td class="message-action">
//                     <button class="edit-btn"><box-icon name='edit'></box-icon></button>
//                     <button class="delete-btn" onclick="deleteBlog(${index})"><box-icon name='trash'></box-icon></button>
//                 </td>
//             `;
//             blogTableBody.appendChild(blogRow);
//         });
//     }
// }

// // Function to initialize data
// function addData() {
//     let title = document.getElementById('title');
//     let description;

//     // Check if tinyMCE is available and if the element exists
//     if (typeof tinyMCE !== 'undefined' && tinyMCE.get('myTextarea')) {
//         description = tinyMCE.get('myTextarea').getContent();
//     } else {
//         // If tinyMCE is not available, fallback to using plain HTML element
//         description = document.getElementById('myTextarea');
//     }

//     let image = document.getElementById('imageInput');
//     let imageError = document.getElementById('imageError');

//     if (localStorage.getItem('blogList') === null) {
//         blogList = [
//             {
//                 title: "Your Manually Added Title 1",
//                 image: "./images/food.png", // Replace this with the path to your image
//                 description: "Your manually added description 1."
//             },
//             {
//                 title: "Your Manually Added Title 2",
//                 image: "images/passion.svg", // Replace this with the path to your image
//                 description: "Your manually added description 2."
//             },
//             // Add more as needed
//         ];

//         // Convert images to base64
//         blogList.forEach(blog => {
//             convertImageToBase64(blog.image, base64Image => {
//                 blog.image = base64Image;
//             });
//         });

//         // Save the initial data to local storage
//         localStorage.setItem('blogList', JSON.stringify(blogList));
//     } else {
//         blogList = JSON.parse(localStorage.getItem('blogList'));
//     }

//     // Calling the updateBlogTable function to display the initial blog list
//     updateBlogTable();
// }

// // Function to delete a blog
// function deleteBlog(index) {
//     // Check if the index is valid
//     if (index >= 0 && index < blogList.length) {
//         // Remove the blog at the specified index
//         blogList.splice(index, 1);

//         // Update the blog table
//         updateBlogTable();

//         // Save the updated data to local storage
//         localStorage.setItem('blogList', JSON.stringify(blogList));
//     }
// }
// document.addEventListener("DOMContentLoaded", function () {
//     // Call AddData to initialize data
//     addData();
// });
