document
  .getElementById("login-form")
  .addEventListener("submit", function (event) {
    event.preventDefault();
    const email = document.getElementById("login-email").value;
    const password = document.getElementById("login-password").value;

    fetch("http://localhost:5000/api/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.authToken) {
          localStorage.setItem("authToken", data.authToken);
          window.location.href = "/home/index.html";
        } else {
          alert("Credenciais inválidas. Por favor, tente novamente.");
        }
      })
      .catch((error) => {
        console.error("Erro ao fazer login:", error);
      });
  });
