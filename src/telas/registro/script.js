document
  .getElementById("register-form")
  .addEventListener("submit", function (event) {
    event.preventDefault();
    const name = document.getElementById("register-name").value;
    const email = document.getElementById("register-email").value;
    const password = document.getElementById("register-password").value;
    const password2 = document.getElementById("register-password2").value;

    fetch("http://localhost:3000/api/users/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name, email, password, password2 }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.res == "Suceccs") {
          console.log(data)
          console.log("Registro bem-sucedido. Por favor, faça login.");
          window.location.href = "/src/telas/login/index.html?";
        } else {
          console.log(data)
          console.log("Erro no registro. Por favor, tente novamente.");
        }
      })
      .catch((error) => {
        console.error("Erro ao fazer registro:", error);
      });
  });
