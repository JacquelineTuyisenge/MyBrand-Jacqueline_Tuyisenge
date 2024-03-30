(function () {
    "use strict";
  
      // register validation
  
      const fullName = document.getElementById("Fname");
      const email = document.getElementById("email");
      const password = document.getElementById("password");
      const signInForm = document.getElementById("signin-form");
    //   const errorElement = document.getElementById("error");
      const loader = document.querySelector(".loader");
      const popup = document.getElementById("popup");
  
      loader.style.display = "none";
  
      signInForm.addEventListener("submit", async (e) => {
        e.preventDefault();
  
        loader.style.display = "flex";
        //errors
        let messages = [];
  
        if (fullName.value.trim() === "" || fullName.value == null) {
          messages.push("Full Name is required");
        }
  
        if (email.value.trim() === "") {
          messages.push("Email is required");
        } else {
          var emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
          if (!emailRegex.test(email.value)) {
            messages.push("Invalid Email");
          }
        }
  
        if (password.value.trim() === "") {
          messages.push("Password is required");
        } else {
          // Password length between 6 and 8 characters
          if (password.value.length < 6 || password.value.length > 10) {
            messages.push("Password must be between 6 and 10 characters");
          }
  
          // At least one uppercase letter, one lowercase letter, and one digit
          var passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{6,10}$/;
          if (!passwordRegex.test(password.value)) {
            messages.push(
              "Password must contain at least one uppercase letter, one lowercase letter, and one digit"
            );
          }
        }
  
        // Display error messages if any
        if (messages.length > 0) {
          // e.preventDefault();
          // errorElement.innerText = messages.join(", ");
        }
  
        // integration with backend
  
        const data = {
          fullName: fullName.value,
          email: email.value,
          password: password.value,
        };
  
        try {
          const response = await fetch(
            "https://mybrand-be-ecx9.onrender.com/api/users/login",
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify(data),
            }
          );
  
          if (response.ok) {
  
            const responseData = await response.json();
              loader.style.display = "none";
              popup.classList.remove("hidden");
              popup.innerText = responseData.message;

              //storing token in local storage
              const userEmail = email.value.toLowerCase();

              localStorage.setItem("token", responseData.token);

            //check if user is admin or not
            function parseJWT(token) {
                const base64Url = token.split('.')[1];
                const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
                const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
                    return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
                }).join(''));
            
                return JSON.parse(jsonPayload);
            }
            
            const decodedToken = parseJWT(responseData.token);
            console.log(decodedToken);

              setTimeout(() => {
                if (decodedToken.role === 'Admin') {
                    window.location.href = "dashboard.html";
                } else {
                    window.location.href = "index.html"; 
                }
              }, 5000);
              console.log(response.json());
          }else {
            const errorData = await response.json();
            loader.style.display = "none";
            popup.classList.remove("hidden");
            popup.innerText = errorData.message;
            setTimeout(() => {
              popup.classList.add("hidden");
            }, 5000);
          }
          
        } catch (error) {
          loader.style.display = "none";
          console.log(error);
        }
      });
   
  })();
  