export async function isAuthenticated() {
  try {
    const response = await fetch("http://localhost:3000/api/isLogged", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    });

    if (!response.ok) {
      throw new Error("Usuário não autenticado");
    }

    const data = await response.json();
    console.log("sucesso", data);
    return true;
  } catch (error) {
    console.log("falha", error);
    return false;
  }
}
