interface Options extends RequestInit {
  token?: string;
}

const methods = ["get", "post", "put", "delete"] as const;

type ClientMethod = <T>(url: string, { token, ...init }: Options) => Promise<T>;

type Client = {
  [method in (typeof methods)[number]]: ClientMethod;
} & ClientMethod;

function createMethodClient(baseURL: string, method: (typeof methods)[number]) {
  return <T>(url: string, { token, ...init }: Options) => {
    const headers = Object.assign(
      {},
      init.headers,
      token && { Authorization: `Bearer ${token}` },
    );

    return fetch(new URL(url, baseURL), {
      ...init,
      method,
      headers,
    }).then((res) => res.json()) as Promise<T>;
  };
}

export function createClient(baseURL: string): Client {
  const client = createMethodClient(baseURL, "get") as Client;
  client.get = createMethodClient(baseURL, "get");
  client.delete = createMethodClient(baseURL, "delete");
  client.post = createMethodClient(baseURL, "post");
  client.put = createMethodClient(baseURL, "put");
  return client;
}
