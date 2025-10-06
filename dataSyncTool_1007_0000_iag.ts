// 代码生成时间: 2025-10-07 00:00:33
// dataSyncTool.ts
import { ApolloClient, InMemoryCache, gql } from '@apollo/client';
import { onError } from '@apollo/client/link/error';
import { ApolloLink, Observable } from '@apollo/client/utilities';
import { retryLink } from '@apollo/client/link/retry';
import fetch from 'cross-fetch';

// Define GraphQL Query for Data Synchronization
const SYNC_DATA_QUERY = gql`
  query SyncDataQuery($lastSyncTime: String!) {
    syncData(lastSyncTime: $lastSyncTime) {
      id
      timestamp
      data
    }
  }
`;

// Define a custom error link to handle errors
const errorLink = onError(({ graphQLErrors, networkError }) => {
  if (graphQLErrors) {
    graphQLErrors.forEach(({ message, locations, path }) => {
      console.log("[GraphQL error]:", message, locations, path);
    });
  }

  if (networkError) {
    console.log(`[Network error]: ${networkError}`);
  }
});

// Define a retry link for handling retry logic on failed requests
const retryLinkInstance = retryLink({
  delay: {
    initial: 300, // 300ms delay for the first retry
    max: Infinity, // Maximum delay between retries
    jitter: true, // Add jitter to the retry delays to avoid thundering herd problem
  },
  attempts: {
    max: 3, // Maximum number of attempts (retries + 1)
    retryIf: (error) => error.result.errors // Retry only if there are GraphQL errors.
      ? error.result.errors.some((err) => err.message.includes('rate limit exceeded'))
      : false,
  },
});

// Create Apollo Client with error and retry links
const client = new ApolloClient({
  link: ApolloLink.from([errorLink, retryLinkInstance,
    // Provide your own endpoint for your GraphQL server
    new ApolloLink(fetch, { uri: 'https://your-graphql-endpoint.com' }),
  ]),
  cache: new InMemoryCache(),
});

// Function to perform data synchronization
async function synchronizeData(lastSyncTime: string): Promise<void> {
  try {
    const { data } = await client.query({
      query: SYNC_DATA_QUERY,
      variables: { lastSyncTime },
    });

    if (data && data.syncData) {
      // Handle the synchronous data here, for example, save to a database or process it
      console.log("Synchronized data:", data.syncData);
    } else {
      console.log("No new data to synchronize.");
    }
  } catch (error) {
    console.error("Failed to synchronize data: ", error);
    // Handle error appropriately, possibly retry or log
  }
}

// Example usage of the synchronizeData function
// Replace 'lastSyncTime' with an actual timestamp or identifier for the last sync time
synchronizeData('2023-04-01T00:00:00Z').then(() => {
  console.log("Data synchronization complete.");
}).catch((error) => {
  console.error("Data synchronization failed: ", error);
});

export { synchronizeData };