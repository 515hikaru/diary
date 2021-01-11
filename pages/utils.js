import ApolloClient from "apollo-boost";
import gql from "graphql-tag";

import { loginUserName, articleLabelId } from "./constants";

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

export const fetchDiaryArticles = async () => {
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

  const query = gql`
    query {
      repository(owner: "515hikaru", name: "diary") {
        issues(last: 100, orderBy: { field: CREATED_AT, direction: DESC }) {
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
        }
      }
    }
  `;

  const data = await client
    .query({
      query,
    })
    .then((result) => {
      const issueEdges = result.data.repository.issues.edges;
      return filterDiary(issueEdges);
    });
  return {
    props: {
      issues: data.map((item) => {
        const url = new URL(item.node.url);
        item.node.number = url.pathname.split("/").slice(-1)[0];
        return item;
      }),
    },
  };
};

export const fetchArticleBody = async (number) => {
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
    diary: data
  },
};

};
