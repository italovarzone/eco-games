document
  .getElementById("login-form")
  .addEventListener("submit", function (event) {
    event.preventDefault();
    const email = document.getElementById("login-email").value;
    const password = document.getElementById("login-password").value;

    fetch("http://localhost:3000/api/users/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data)
        if (data.booleanAuth) {
          localStorage.setItem("email", email);
          window.location.href = "/src/telas/home/index.html?";
        } else {
          console.log("Credenciais inválidas. Por favor, tente novamente.");
        }
      })
      .catch((error) => {
        console.error("Erro ao fazer login:", error);
      });
  });
