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

  // const myBlogArray = JSON.parse(localStorage.getItem('myBlogs')) || [];
  // const reader = new FileReader();
  // reader.onload = () => {
  //     const articleImage = reader.result;
  //     const articleContents = {
  //         blogImage: articleImage,
  //         blogTitle: title,
  //         blogDate: date,
  //         blogLike: 0,
  //         blogComments: 0,
  //         blogDescription: description
  //     };
  //     myBlogArray.unshift(articleContents);
  //     localStorage.setItem('myBlogs', JSON.stringify(myBlogArray));
  //     window.location.href='blog-cards.html';
  // }
  // reader.readAsDataURL(image);
});
