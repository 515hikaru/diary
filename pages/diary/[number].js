// pages/blog/[id].js
import styles from "../../styles/Home.module.css";
import { fetchDiaryArticles, fetchArticleBody } from "../utils";

export default function DiaryId({ diary }) {
  return (
    <main className={styles.main}>
      <h1 className={styles.title}>{diary.title}</h1>
      <p className={styles.publishedAt}>{dateFormat(diary.createdAt)}</p>
      <div
        dangerouslySetInnerHTML={{
          __html: `${diary.bodyHTML}`,
        }}
      />
    </main>
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
    const date = new Date(dateString)
    return `${date.getFullYear()}-${date.getMonth()+1}-${date.getDate()}`
}