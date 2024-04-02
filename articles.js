// // Declare blogList in the global scope
// let blogList;

// Form validation
function validateForm(event) {
  event.preventDefault();

  let title = document.getElementById("title").value;
  let description = document.getElementById("content").value;
  let author = document.getElementById("author").value;

  const errorMessage = "Title or Description cannot be empty!";

  if (title === "" && description === "" && author === "") {
    document.getElementById("error").textContent = errorMessage;
    return;
  }
}

// addblog
const formEl = document.getElementById("articleForm");
const loader = document.querySelector(".loader");
const popup = document.getElementById("popup");

loader.style.display = "none";

formEl.addEventListener("submit", async function (event) {
  event.preventDefault();

  loader.style.display = "block";

  const imageUrl = document.getElementById("image").files[0];
  const title = document.getElementById("title").value;
  const description = tinymce.get("content").getContent({ format: "json" });
  let author = document.getElementById("author").value;

  //get the token in local storage to set the only admins to be able to create a blog

  const token = localStorage.getItem("token");

  const headers = {
    Authorization: `Bearer ${token}`,
  };
  // create formData object to backend API
  const formData = new FormData();

  formData.append("imageUrl", imageUrl);
  formData.append("title", title);
  formData.append("content", description);
  formData.append("author", author);

  // send api to create a blog

  try {
    const response = await fetch(
        "https://mybrand-be-ecx9.onrender.com/api/blogs",
      {
        method: "POST",
        body: formData,
        headers: headers
      });

    if (response.ok) {
      const responseData = await response.json();
     

      loader.style.display = "none";
      popup.classList.remove("hidden");
      popup.innerText = responseData.message;

      console.log(responseData);
      
      setTimeout(() => {
        window.location.href = "index.html";
      }, 10000);
    } else {
      const errorData = await response.json();
      console.log(errorData);

      loader.style.display = "none";
      popup.classList.remove("hidden");
      popup.innerText = errorData.message;
      setTimeout(() => {
        popup.classList.add("hidden");
      }, 5000);
    }
  } catch(error){
    console.log(error);
    loader.style.display = "none";
  }
});

// edit the single blog

async function fetchBlogById(id) {
  try {
    const response = await fetch(
      `https://mybrand-be-ecx9.onrender.com/api/blogs/${id}`
    );
    if (!response.ok) {
      throw new Error("Error fetching blog");
    }
    const blog = await response.json();
    return blog;
  } catch (error) {
    console.error("Error fetching blog", error);
    return null;
  }
}

// function to populate the edit form with the blog details

async function populateEditForm(id) {
  try{
    const blog = await fetchBlogById(id);
    console.log("Blog:", blog);

    if (!blog) {
      console.error("Blog not found");
      return;
    }

    document.getElementById("image").files[0] = blog.imageUrl;
    document.getElementById("title").value = blog.title;
    document.getElementById("author").value = blog.author;
    tinymce.get("content").setContent(blog.content); // set the content of the tinymce editor

  } catch (error) {
    console.error("Error fetching blog", error);
  }
}


// update the blog

async function updateBlog(id) {
  try{
    const token = localStorage.getItem("token");
    const headers = {
      Authorization: `Bearer ${token}`,
    };
   const response = await fetch(
    `https://mybrand-be-ecx9.onrender.com/api/blogs/${id}`,{
      method: "PATCH",
      body: formData,
      headers: headers
    }
   );

   if(response.ok){
    const responseData = await response.json();
    console.log(responseData);

    loader.style.display = "none";
    popup.classList.remove("hidden");
    popup.innerText = responseData.message;

    setTimeout(() => {
      window.location.href = "index.html";
    }, 10000);
   } else {
    const errorData = await response.json();
    console.error(errorData);

    loader.style.display = "none";
    popup.classList.remove("hidden");
    popup.innerText = errorData.message;

    setTimeout(() => {
      popup.classList.add("hidden");
    }, 5000);
   }
  } catch(error){
    console.error("Error updating blog",error);
    loader.style.display = "none";
  }
}