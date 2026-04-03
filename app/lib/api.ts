const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api";

export async function registerUser(
  email: string,
  password: string,
  name?: string,
) {
  const res = await fetch(`${API_URL}/auth/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password, name }),
  });

  if (!res.ok) {
    const data = await res.json();
    throw new Error(data.message || "Erro no registo");
  }

  return res.json();
}

export async function loginUser(email: string, password: string) {
  const res = await fetch(`${API_URL}/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
  });

  if (!res.ok) {
    const data = await res.json();
    throw new Error(data.message || "Erro no login");
  }

  return res.json();
}

export async function createStaging(
  token: string,
  image: string,
  mask: string,
  style: string,
  prompt: string,
  imageWidth?: number,
  imageHeight?: number,
) {
  const res = await fetch(`${API_URL}/staging`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      image,
      mask,
      style,
      prompt,
      width: imageWidth,
      height: imageHeight,
    }),
  });

  if (!res.ok) {
    const data = await res.json();
    throw new Error(data.message || "Erro no staging");
  }

  return res.json();
}
