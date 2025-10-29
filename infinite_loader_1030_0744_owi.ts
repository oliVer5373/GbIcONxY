// 代码生成时间: 2025-10-30 07:44:51
import { useQuery, gql } from '@apollo/client';
import { useState, useEffect } from 'react';
import { InfiniteLoader, AutoSizer } from 'react-virtualized';
import { List as VirtualList } from 'react-virtualized';
import './styles.css'; // Assuming a styles file for component styling

// GraphQL query for fetching data with pagination
const GET_DATA = gql`
  query GetData($cursor: String) {
    data(after: $cursor) {
      edges {
        node {
          id
          name
        }
      }
      pageInfo {
        endCursor
        hasNextPage
      }
    }
  }
`;

// Component for displaying a list of items with infinite loading
const InfiniteList = () => {
  // State to store data and pagination information
  const [data, setData] = useState([]);
  const [pageInfo, setPageInfo] = useState({ endCursor: null, hasNextPage: true });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Use GraphQL query hook to fetch data
  const { data: queryData, loading: queryLoading, error: queryError } = useQuery(GET_DATA, {
    variables: { cursor: pageInfo.endCursor },
    fetchPolicy: 'cache-and-network',
  });

  // Handle new data arrival from GraphQL query
  useEffect(() => {
    if (queryData && queryData.data) {
      const newEdges = queryData.data.edges;
      setData((prevData) => [...prevData, ...newEdges]);
      setPageInfo(queryData.data.pageInfo);
    }
  }, [queryData]);

  // Handle query errors
  useEffect(() => {
    if (queryError) {
      setError(queryError.message);
      setLoading(false);
    }
  }, [queryError]);

  // Load more data when the end of the list is reached
  const isRowLoaded = ({ index }) => index < data.length;
  const loadMoreRows = ({ startIndex, stopIndex }) => {
    if (!isRowLoaded({ index: stopIndex })) {
      setLoading(true);
      // GraphQL query is already set up to handle pagination, so no additional action is needed here
    }
  };

  // Render the list with virtualization for better performance
  return (
    <AutoSizer>
      {({ height, width }) => (
        <VirtualList
          height={height}
          width={width}
          rowHeight={40}
          rowRenderer={({ index, key, style }) => (
            <div key={key} style={style}>
              {data[index].node ? data[index].node.name : 'Loading...'}
            </div>
          )}
          rowCount={data.length}
          isRowLoaded={isRowLoaded}
          loadMoreRows={loadMoreRows}
          className="infinite-list"
        />
      )}
    </AutoSizer>
  );
};

export default InfiniteList;