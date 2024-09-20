export async function getCrosswoldRanking() {  try {
    const response = await fetch("http://localhost:3000/api/ranking/crossworld", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    });
    
    return await response.json();
    
  } catch (error) {
    console.log(error);
    return null;
  }
}

