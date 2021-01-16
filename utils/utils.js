import ApolloClient from "apollo-boost";
import gql from "graphql-tag";

import { loginUserName, articleLabelId } from "./constants";

const client = new ApolloClient({
  uri: "https://api.github.com/graphql",
  request: (operation) => {
    operation.setContext({
      headers: {
        authorization: `Bearer ${process.env.PERSONAL_ACCESS_TOKEN}`,
      },
    });
  },
});

const filterArticleLabel = (labels) => {
  return labels.filter((label) => {
    return label.node.id == articleLabelId;
  });
};

const filterDiary = (issues) => {
  return issues
    .filter((issue) => {
      return issue.node.author.login === loginUserName;
    })
    .filter((issue) => {
      const filteredLabels = filterArticleLabel(issue.node.labels.edges);
      return filteredLabels.length > 0;
    });
};

const totalCountIssues = async () => {
  const query = gql`
    query {
      repository(owner: "515hikaru", name: "diary") {
        issues {
          totalCount
        }
      }
    }
  `;
  const count = await client
    .query({
      query,
    })
    .then((result) => {
      return result.data.repository.issues.totalCount;
    });

  return count;
};

export const fetchDiaryArticles = async () => {
  const issueCount = await totalCountIssues();
  const results = [];
  const num = 5
  let cursor = null
  for (let i = 0; i < issueCount; i += num) {
    const query = gql`
      query Issues($cursor: String){
        repository(owner: "515hikaru", name: "diary") {
          issues(first: ${num} after: $cursor, orderBy: { field: CREATED_AT, direction: DESC }) {
            edges {
              node {
                id
                title
                url
                createdAt
                author {
                  login
                }
                labels(first: 5) {
                  edges {
                    node {
                      id
                      name
                    }
                  }
                }
              }
            }
            pageInfo {
              endCursor
            }
          }
        }
      }
    `;
    const data = await client
      .query({
        query,
        variables: { cursor }
      })
      .then((result) => result);
    cursor = data.data.repository.issues.pageInfo.endCursor;
    results.push(...filterDiary(data.data.repository.issues.edges))
  }

  return {
    props: {
      issues: results.map((item) => {
        const url = new URL(item.node.url);
        item.node.number = url.pathname.split("/").slice(-1)[0];
        return item;
      }).sort((a, b) => {
        if(a.createdAt > b.createdAt) return -1;
        if(a.createdAt < b.createdAt) return 1;
        return 0
      }),
    },
  };
};

export const fetchArticleBody = async (number) => {
  const query = gql`
    {
      repository(owner: "515hikaru", name: "diary") {
        issue(number: ${number}) {
          id
          title
          createdAt
          bodyHTML
        }
      }
    }
  `;
  const data = await client
    .query({
      query,
    })
    .then((result) => {
      return result.data.repository.issue;
    });

  return {
    props: {
      diary: data,
    },
  };
};
