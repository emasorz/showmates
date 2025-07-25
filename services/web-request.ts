import axios from 'axios';

export type Method = 'get' | 'post' | 'patch' | 'delete' | 'GET' | 'POST' | 'PATCH' | 'DELETE'

const token:string = process.env.EXPO_PUBLIC_API_KEY;

export const webRequest = async <T>(method: Method, url: string, body: T, headers?: Record<string, string>) => {
  try {
    const config:any = {
      body,
      headers: {...{Authorization: `Bearer ${token}`, accept:'application/json'},headers}, // Add the headers to the request configuration
    };

    const response = await axios[method.toLowerCase() as 'get' | 'post' | 'patch' | 'delete'](url, config);
    return response.data;
  } catch (error) {
    console.error('Error fetching data:', error);
  }
};