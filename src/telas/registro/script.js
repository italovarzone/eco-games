document
  .getElementById("register-form")
  .addEventListener("submit", function (event) {
    event.preventDefault();
    const email = document.getElementById("register-email").value;
    const password = document.getElementById("register-password").value;

    fetch("http://localhost:5000/api/auth/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          alert("Registro bem-sucedido. Por favor, faça login.");
          window.location.href = "/login/login.html";
        } else {
          alert("Erro no registro. Por favor, tente novamente.");
        }
      })
      .catch((error) => {
        console.error("Erro ao fazer registro:", error);
      });
  });
