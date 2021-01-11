import Head from "next/head";
import Link from "next/link";
import styles from "../styles/Home.module.css";

import { fetchDiaryArticles } from "./utils";

function Artilce(issue) {
  console.log(issue);
  return (
    <Link href={`diary/${issue.number}`}>
      <a key={issue.id} className={styles.card}>
        {issue.title}
      </a>
    </Link>
  );
}

export default function Home({ issues }) {
  return (
    <div className={styles.container}>
      <Head>
        <title>515hikaru Diary</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>Welcome to @515hikaru's diary!</h1>

        <div className={styles.grid}>
          {issues.map((issue) => Artilce(issue.node))}
        </div>
      </main>

      <footer className={styles.footer}>
        <a
          rel="license"
          href="http://creativecommons.org/licenses/by-nc-nd/4.0/"
        >
          <img
            alt="クリエイティブ・コモンズ・ライセンス"
            style={{ borderWidth: 0 }}
            src="https://i.creativecommons.org/l/by-nc-nd/4.0/88x31.png"
          />
        </a>
        &nbsp; 当ブログは
        <a
          rel="license"
          href="http://creativecommons.org/licenses/by-nc-nd/4.0/"
        >
          クリエイティブ・コモンズ 表示 - 非営利 - 改変禁止 4.0 国際 ライセンス
        </a>
        の下に提供されています。
      </footer>
    </div>
  );
}

export const getStaticProps = async () => {
  return await fetchDiaryArticles()
};
