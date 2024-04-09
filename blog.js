// functional component

// const Blog = () => {

//     return (
//         <section class="blog-page" id="blog">
//             <div>
//                 <h3>Blog Page</h3>
//             </div>
//             <span class="loader"></span>
//             <div id="popup" class="popup hidden">Blog retrieval is Successful!</div>
//         </section>
//     )
// }
//****************************Normal Function******************************** */
const loader = document.querySelector(".loader");
      const popup = document.getElementById("popup");

      // fetch blogs from server and display them in table

      async function fetchBlogs() {
        loader.style.display = "block";
        try {
          const response = await fetch(
            "https://mybrand-be-ecx9.onrender.com/api/blogs"
          );
          if (!response.ok) {
            loader.style.display = "none";
            popup.classList.remove("hidden");
            popup.innerText = "Error fetching blogs";

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
          return blogs.data;
        } catch (error) {
          console.error("Error fetching blogs", error);
          return [];
        }
      }

      //update blog table with fetched blogs

      async function updateBlogTable() {
        const blogTableBody = document.getElementById("blogTableBody");
        blogTableBody.innerHTML = "";

        const blogs = await fetchBlogs();
        blogs.reverse().forEach((blog) => {
          const row = document.createElement("tr");
          row.innerHTML = `
           <td>${new Date(blog.createdAt).toLocaleDateString()}</td>
           <td>${blog.author}</td>
           <td><img src="${blog.imageUrl}" alt="${
            blog.title
          }" class="message-image"></td>
           <td>${truncateText(blog.title, 50)}</td>
           <td>${truncateText(blog.content, 100)}</td>
           <td class="message-action">
               <a href="updateArticle.html?id=${blog._id}" class="edit-btn">
                   <box-icon name="edit"></box-icon>
               </a>
               <button class="delete-btn" onclick="deleteBlog('${blog._id}')">
                   <box-icon name="trash"></box-icon>
               </button>
           </td>
           `;
          blogTableBody.appendChild(row);
        });
      }
      //truncateText
      function truncateText(text, maxLength) {
        return text.length > maxLength
          ? text.slice(0, maxLength) + "..."
          : text;
      }

      // functions to delete certain blog in table

      const token = localStorage.getItem("token");
      async function deleteBlog(id) {
        loader.style.display = "block";

        console.log("the blog id is :", id);
        try {
          const response = await fetch(
            `https://mybrand-be-ecx9.onrender.com/api/blogs/${id}`,
            {
              method: "DELETE",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
            }
          );
          if (response.ok) {
            loader.style.display = "none";
            popup.classList.remove("hidden");
            popup.innerText = "Blog deleted successfully";

            setTimeout(() => {
              popup.classList.add("hidden");
            }, 3000);
            updateBlogTable();
          } else {
            loader.style.display = "none";
            popup.classList.remove("hidden");
            popup.innerText = "Failed to delete blog.";

            setTimeout(() => {
              popup.classList.add("hidden");
            }, 3000);
          }
        } catch (error) {
          console.error("Error deleting blog", error);
        }
      }

      //update blog inside where blog are created


      window.onload = updateBlogTable;