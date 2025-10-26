// 代码生成时间: 2025-10-26 08:51:05
import { useState, useEffect } from 'react';
import { useQuery, gql } from '@apollo/client';

// 定义GraphQL查询，用于获取数据
const GET_DATA_QUERY = gql`
  query GetData($cursor: String) {
    data(after: $cursor) {
      edges {
        node {
          id
          value
        }
      }
      pageInfo {
        endCursor
        hasNextPage
      }
    }
  }
`;

interface DataNode {
  id: string;
  value: string;
}

interface PageInfo {
  endCursor: string;
  hasNextPage: boolean;
}

interface QueryResponse {
  data: {
    edges: Array<{ node: DataNode }>;
    pageInfo: PageInfo;
  };
}

interface QueryVariables {
  cursor: string;
}

const InfiniteScrollComponent = () => {
  // 定义状态
  const [data, setData] = useState<DataNode[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [hasNextPage, setHasNextPage] = useState<boolean>(true);

  // 使用GraphQL查询
  const { data: queryData, loading: queryLoading, fetchMore } = useQuery<QueryResponse, QueryVariables>(GET_DATA_QUERY, {
    variables: {
      cursor: null
    },
    notifyOnNetworkStatusChange: true,
  });

  useEffect(() => {
    // 合并新数据
    if (queryData) {
      setData(prevData => [...prevData, ...queryData.data.edges.map(edge => edge.node)]);
      setHasNextPage(queryData.data.pageInfo.hasNextPage);
    }
  }, [queryData]);

  useEffect(() => {
    // 无限加载逻辑
    if (loading && hasNextPage) {
      const handleScroll = () => {
        window.innerHeight + document.documentElement.scrollTop <= document.documentElement.offsetHeight - 1;
        if (hasNextPage) {
          setLoading(true);
          fetchMore<QueryResponse, QueryVariables>({
            variables: {
              cursor: queryData.data.pageInfo.endCursor,
            },
            updateQuery: (prev, { fetchMoreResult }) => {
              if (!fetchMoreResult || !fetchMoreResult.data) return prev;
              return {
                ...prev,
                data: {
                  ...prev.data,
                  edges: [...prev.data.edges, ...fetchMoreResult.data.edges],
                  pageInfo: fetchMoreResult.data.pageInfo,
                },
              };
            },
          });
        }
      };

      window.addEventListener('scroll', handleScroll);
      return () => {
        // 清除事件监听
        window.removeEventListener('scroll', handleScroll);
      };
    }
  }, [loading, hasNextPage]);

  return (
    <div>
      {data.map(item => (
        <div key={item.id}>{item.value}</div>
      ))}
      {loading && <p>Loading...</p>}
    </div>
  );
};

export default InfiniteScrollComponent;