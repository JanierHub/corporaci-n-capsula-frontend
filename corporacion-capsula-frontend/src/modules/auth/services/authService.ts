export const registerUser = async (data: any) => {
  const res = await fetch("http://localhost:3000/api/v1/user", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      nombre: data.name,
      edad: Number(data.age || 18),
      contraseña: data.password,
    }),
  });

  return res.json();
};