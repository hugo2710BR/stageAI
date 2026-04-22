const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api";

function handleUnauthorized(res: Response) {
  if (res.status === 401 && typeof window !== "undefined") {
    import("js-cookie").then(({ default: Cookies }) => Cookies.remove("token"));
    window.location.href = "/login";
  }
}

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
  mask: string | undefined,
  style: string,
  prompt: string,
  imageWidth?: number,
  imageHeight?: number,
  seed?: number,
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
      seed,
    }),
  });

  if (!res.ok) {
    handleUnauthorized(res);
    const data = await res.json();
    throw new Error(data.message || "Erro no staging");
  }

  return res.json();
}

export async function deleteStaging(token: string, id: string) {
  const res = await fetch(`${API_URL}/staging/${id}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!res.ok) {
    handleUnauthorized(res);
    const data = await res.json();
    throw new Error(data.message || "Erro ao apagar staging");
  }
}

export async function getUsage(token: string): Promise<{
  plan: string;
  used: number;
  limit: number | null;
  remaining: number | null;
}> {
  const res = await fetch(`${API_URL}/staging/usage`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!res.ok) {
    handleUnauthorized(res);
    const data = await res.json();
    throw new Error(data.message || 'Erro ao carregar uso');
  }

  return res.json();
}

export type Plan = {
  id: string;
  name: string;
  displayName: string;
  price: number;
  currency: string;
  limit: number | null;
  features: string[];
  highlighted: boolean;
  sortOrder: number;
  lsVariantId: string | null;
};

export async function createCheckout(token: string, planName: string): Promise<string> {
  const res = await fetch(`${API_URL}/payments/checkout`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ planName }),
  });

  if (!res.ok) {
    handleUnauthorized(res);
    const data = await res.json();
    throw new Error(data.message || 'Erro ao criar checkout');
  }

  const data = await res.json();
  return data.url;
}

export async function getPlans(): Promise<Plan[]> {
  const res = await fetch(`${API_URL}/plans`);
  if (!res.ok) throw new Error('Erro ao carregar planos');
  return res.json();
}

export type Account = {
  name: string | null;
  email: string;
  plan: string;
  planDisplayName: string;
  planUpgradedAt: string | null;
  used: number;
  limit: number | null;
  remaining: number | null;
};

export async function getAccount(token: string): Promise<Account> {
  const res = await fetch(`${API_URL}/account`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) {
    handleUnauthorized(res);
    const data = await res.json();
    throw new Error(data.message || 'Erro ao carregar conta');
  }
  return res.json();
}

export async function updateAccount(token: string, name: string): Promise<{ name: string }> {
  const res = await fetch(`${API_URL}/account`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify({ name }),
  });
  if (!res.ok) {
    handleUnauthorized(res);
    const data = await res.json();
    throw new Error(data.message || 'Erro ao atualizar conta');
  }
  return res.json();
}

export async function deleteAccount(token: string): Promise<void> {
  const res = await fetch(`${API_URL}/account`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) {
    handleUnauthorized(res);
    const data = await res.json();
    throw new Error(data.message || 'Erro ao eliminar conta');
  }
}

export async function getStagingHistory(token: string) {
  const res = await fetch(`${API_URL}/staging`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!res.ok) {
    handleUnauthorized(res);
    const data = await res.json();
    throw new Error(data.message || "Erro ao carregar histórico");
  }

  return res.json() as Promise<
    {
      id: string;
      style: string;
      prompt: string | null;
      resultUrl: string | null;
      status: string;
      createdAt: string;
    }[]
  >;
}
