// edit the single blog

const loader = document.querySelector(".loader");
const popup = document.getElementById("popup");

const urlParams = new URLSearchParams(window.location.search);
const id = urlParams.get("id");
window.onload = async() => {
    try {
      const response = await fetch(
        `https://mybrand-be-ecx9.onrender.com/api/blogs/${id}`
      );
      if (!response.ok) {
        throw new Error("Error fetching blog");
      }
  
      const blog = await response.json();
    //   const input = document.getElementById("image").files[0];
    //   document.getElementById("image").files[0] = input !== undefined ? input : blog.imageUrl;
      document.getElementById("title").value = blog.title;
      document.getElementById("author").value = blog.author;
      tinymce.get("content").setContent(blog.content);

      loader.style.display = "none";
      console.log("the image is :", document.getElementById("image").files[0]);
     
        // document.getElementById("submit").innerHTML = "Update";
        
        document.getElementById("articleForm").addEventListener("submit", (event) => {
          event.preventDefault();
          updateBlog(id, blog.imageUrl);
        })

    } catch (error) {
      console.error("Error fetching blog", error);
      return null;
    }
  }
  
  
  // update the blog
  
  async function updateBlog(id, blogImage) {
    try{
        const input = document.getElementById("image").files[0];
        const imageUrl = input !== undefined ? input : blogImage;
        const title = document.getElementById("title").value;
        const description = tinymce.get("content").getContent({ format: "json" });
        let author = document.getElementById("author").value;
      
        //get the token in local storage to set the only admins to be able to create a blog
      
        const token = localStorage.getItem("token");

        console.log("the image url is ", imageUrl);
      
        
        // create formData object to backend API
        const formData = new FormData();
      
        formData.append("imageUrl", imageUrl);
        formData.append("title", title);
        formData.append("content", description);
        formData.append("author", author);
      const headers = {
        Authorization: `Bearer ${token}`,
      };
     const response = await fetch(
      `https://mybrand-be-ecx9.onrender.com/api/blogs/${id}`,{
        method: "PATCH",
        headers: headers,
        body: formData
      }
     );
  
     if(response.ok){
      const responseData = await response.json();
      console.log(responseData);
  
      loader.style.display = "none";
      popup.classList.remove("hidden");
      popup.innerText = responseData.message;
  
      setTimeout(() => {
        // window.location.href = "index.html";
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