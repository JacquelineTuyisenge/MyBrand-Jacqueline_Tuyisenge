// Add a class to the header when the user scrolls down, and remove it when they scroll to the top
window.onscroll = function() {
    const header = document.querySelector('header');
    const scrollPosition = window.scrollY;

    if (scrollPosition > 50) { // Adjust the scroll position value based on your needs
        header.classList.add('sticky');
    } else {
        header.classList.remove('sticky');
    }
};

// js for resposive navbar
  const hamburgerIcon = document.getElementById('hamburger');
  const exitIcon = document.getElementById('exit');
  const menu = document.querySelector('.menu');

  hamburgerIcon.addEventListener('click', () => {
      menu.classList.toggle('show');
      hamburgerIcon.style.display = 'none';
      exitIcon.style.display = 'block';
  });

  exitIcon.addEventListener('click', () => {
      menu.classList.remove('show');
      exitIcon.style.display = 'none';
      hamburgerIcon.style.display = 'block';
  });

  const loader = document.querySelector(".loader");
  const popup = document.getElementById("popup");
  const moreBlogsBtn = document.getElementById("more-blogs");
// function to fetch blogs from the server
async function fetchLatestBlogs() {
    loader.style.display = "block";
    try{
        const response = await fetch('https://mybrand-be-ecx9.onrender.com/api/blogs');

        if (!response.ok) {
            loader.style.display = "none";
            popup.classList.remove("hidden");
            popup.innerText = 'Error fetching blogs';

            setTimeout(() => {
                popup.classList.add("hidden");
            }, 5000);
            throw new Error("Error fetching blogs");
        }
    
        const blogs = await response.json();
        loader.style.display = "none";
        popup.classList.remove("hidden");
        popup.innerText = blogs.message;

        setTimeout(() => {
            popup.classList.add("hidden");
        }, 5000);
        const totalBlogs = blogs.data.length;
        return blogs.data.slice(totalBlogs - 3, totalBlogs);
    } catch(error) {
        console.error("Error fetching blogs", error);
        return [];
    }
}

//update the landing page blog section

async function updateBlogSection() {
    const blogSection = document.querySelector('.blog-cards');
    blogSection.innerHTML = '';

    const latestBlogs = await fetchLatestBlogs();
    latestBlogs.forEach(blog => {
        const blogCard = createBlogCard(blog);
        blogSection.appendChild(blogCard);
    });
}

// create blog card element

function createBlogCard(blog) {
    const blogCard = document.createElement('a');
    blogCard.classList.add('blog-card');
    blogCard.href = `single-blog.html?id=${blog._id}`;
    blogCard.innerHTML = `
        <img src="${blog.imageUrl}" alt="${blog.title}">
        <h4>${blog.title}</h4>
        <div class="date-like-comments">
            <div class="date">
                <p>${new Date(blog.createdAt).toLocaleDateString()}</p>
            </div>
            <div class="like">
                <i class='bx bx-heart'></i>
                <p>${blog.blogLikes.length}</p>
            </div>
            <div class="comments">
                <i class='bx bx-message-rounded-dots'></i>
                <p>${blog.blogComments.length}</p>
            </div>
        </div>
    `;
    return blogCard;
}

// function to handle clicking on a blog card

function handleBlogCardClick(blogId) {
    window.location.href = `singleBlog.html?id=${blogId}`;
  }

  // add event listener to the blog cards

  async function cardsEventListener() {
     const blogsContainer = document.getElementById("blogsContainer");
     const blogs = await fetchLatestBlogs();

     blogs.reverse().forEach((blog) => {
       const blogCard = createBlogCard(blog);
       blogCard.addEventListener("click", () => {
        handleBlogCardClick(blog._id);
       });
       blogsContainer.appendChild(blogCard);
     });
  }

  window.onload = function () {
    updateBlogSection();
    cardsEventListener();
  };

moreBlogsBtn.addEventListener('click', () => {
    window.location.href = 'blog-cards.html';
});

// contact form validation

const name = document.getElementById('name');
const email = document.getElementById('email');
const message = document.getElementById('message');
const form = document.getElementById('contact-form');
const errorElement = document.getElementById('error');

form.addEventListener('submit', (e) => {
    //errors
    let messages = [];

    if (name.value === '' || name.value == null){
        messages.push('Name is required')
    }

    if (message.value.length <= 19){
        messages.push('Message can not be less than 20 characters')
    }

    if (messages.length > 0){
        e.preventDefault();
        errorElement.innerText = messages.join(', ')
    }
    
})