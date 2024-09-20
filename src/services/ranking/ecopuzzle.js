export async function getEcopuzzleRanking() {  try {
    const response = await fetch("http://localhost:3000/api/ranking/ecopuzzle", {
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

