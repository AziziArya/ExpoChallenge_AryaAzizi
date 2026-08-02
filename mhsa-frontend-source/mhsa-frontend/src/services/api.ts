const API_BASE_URL = "http://127.0.0.1:8000";

export async function apiPost<T>(
  endpoint: string,
  body: unknown
): Promise<T> {

  const response = await fetch(
    `${API_BASE_URL}${endpoint}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    }
  );


  if (!response.ok) {
    throw new Error(
      `API Error: ${response.status}`
    );
  }


  return response.json();
}