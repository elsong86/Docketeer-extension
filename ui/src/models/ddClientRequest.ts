const DEFAULT_HEADERS = {
  "Content-Type": "application/json"
};

class DdFetchError extends Error {
  statusCode: number;

  constructor(message: string, statusCode: number) {
    super(message);
    Object.setPrototypeOf(this, DdFetchError.prototype);
    this.statusCode = statusCode;
    Error.captureStackTrace(this, this.constructor);
  }
}

// Assuming you have an environment variable or a way to detect if you are in Docker Desktop or a browser
const isDockerDesktop = typeof process !== 'undefined' && process.env.IS_DOCKER_DESKTOP === 'true';

/**
 * @abstract Wrapper function for ddClient and fetch. Tests whether the application is running in browser
 *           versus Docker Desktop and either will use ddClient or fetch. Returns a uniform response across
 *           either instance
 */
export const ddClientRequest = async<T>(url: string, method: 'GET' | 'POST' | 'PUT' | 'DELETE' = 'GET', body: any = {}, headers: any = {}): Promise<T> => {
  if (isDockerDesktop) {
    try {
      const { createDockerDesktopClient } = await import("@docker/extension-api-client");
      const ddClient = createDockerDesktopClient();
      console.log("Docker Desktop client bound successfully.");
      
      const ddClientOptions = { method, url, data: body, headers };
      console.log(`Making ddClient request with options:`, ddClientOptions);
      const ddClientResponse = await ddClient.extension.vm.service.request(ddClientOptions) as Promise<T>;
      console.log(`ddClient request succeeded with response:`, ddClientResponse);
      return ddClientResponse;
    } catch (error) {
      console.error("Error importing Docker Desktop API client:", error);
      throw new Error("Failed to bind Docker Desktop client.");
    }
  } else {
    console.log("Using Fetch as a fallback");
    const fetchOptions: RequestInit = {
      method: method.toUpperCase(),
    };
    if (fetchOptions.method !== 'GET' && fetchOptions.method !== 'DELETE') {
      fetchOptions.body = JSON.stringify(body);
    }

    fetchOptions.headers = { ...DEFAULT_HEADERS, ...headers };
    console.log(`Making fetch request to ${url} with options:`, fetchOptions);
    const result = await fetch(url, fetchOptions);

    if (!result.ok) {
      let errorMessage;
      try {
        const errorData = await result.json();
        errorMessage = errorData.message || JSON.stringify(errorData);
      } catch (err) {
        errorMessage = result.statusText;
      }
      console.error(`Fetch request to ${url} failed with status ${result.status}:`, errorMessage);
      throw new DdFetchError(errorMessage, result.status);
    }

    const responseData = await result.json().catch(err => 'no json') as Promise<T>;
    console.log(`Fetch request to ${url} succeeded with response:`, responseData);
    return responseData;
  }
};

/**
 * @abstract Encodes an object into uri string ie.
 *           {containers: docketeer, uptime: 5 min -> containers=docketeer&uptime=5%20min
 * @param dict key value pair used to construct query.
 * @returns {string} Encoded string for a uri query
 */
export const encodeQuery = (dict: { [key: string]: string }): string => {
  let query = '';
  for (let key in dict) {
    query += `${key}=${encodeURIComponent(dict[key])}&`
  }
  return query.slice(0, -1);
}

// Example usage
// const getRunningContainers = async () => {
//   try {
//     const runningContainers = await ddClientRequest<any[]>('http://localhost:4000/api/docker/container/running');
//     console.log('Running containers:', runningContainers);
//     return runningContainers;
//   } catch (error) {
//     console.error('Error fetching running containers:', error);
//   }
// };

// getRunningContainers();
