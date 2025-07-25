import axios from 'axios';

export type Method = 'query' | 'mutation';

export const graphqlRequest = async <T>(method: Method, url: string, query: string, variables?: T) => {
  try {
    const response = await axios.post(url, {
      query,
      variables,
    }, {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    console.log(response.data);
  } catch (error) {
    console.error('Error fetching GraphQL data:', error);
  }
};