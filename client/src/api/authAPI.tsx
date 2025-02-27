import { UserLogin } from "../interfaces/UserLogin";

const API_URL = "http://localhost:3000/api/login";

const login = async (userInfo: UserLogin) => {
try {
  const response = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Contnet_Type": "application/json",
    },
    body: JSON.stringify(userInfo),
  });


  if (!response.ok) {
    throw new Error("Invalid username or password");
  }

  const data = await response.json();
  return data;
} catch (error) {
  console.error("Login error", error);
  throw error;
}
};



export { login };
