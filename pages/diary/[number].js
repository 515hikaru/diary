// pages/blog/[id].js
import Head from "next/head";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGithubSquare } from "@fortawesome/free-brands-svg-icons";

import styles from "./styles.module.css";

import { fetchDiaryArticles, fetchArticleBody } from "../../utils/utils";

export default function DiaryId({ diary }) {
  return (
    <div>
      <Head>
        <title>{diary.title}</title>
        <link rel="icon" href="/favicon.ico" />
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/npm/spcss@0.6.0"
        ></link>
      </Head>
      <main>
        <h1 className={styles.title}>{diary.title}</h1>
        <div>
          <p className={styles.createdat}>
            {dateFormat(diary.createdAt)}{" "}
            <a href={diary.url}>
              <FontAwesomeIcon
                className={styles.github}
                icon={faGithubSquare}
                size="xs"
              />
            </a>
          </p>
        </div>
        <div
          dangerouslySetInnerHTML={{
            __html: `${diary.bodyHTML}`,
          }}
        />
      </main>
    </div>
  );
}

export const getStaticPaths = async () => {
  const issues = await fetchDiaryArticles();
  const paths = issues.props.issues.map(
    (issue) => `/diary/${issue.node.number}`
  );
  return { paths, fallback: false };
};

export const getStaticProps = async (context) => {
  const number = context.params.number;
  return await fetchArticleBody(number);
};

const dateFormat = (dateString) => {
  const date = new Date(dateString);
  return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
};
