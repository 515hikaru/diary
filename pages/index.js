import Head from "next/head";
import Link from "next/link";

import styles from "./styles.module.css";

import { fetchDiaryArticles } from "../utils/utils";

function Artilce(issue) {
  return (
    <div key={issue.id} className={styles.article}>
      <Link href={`diary/${issue.number}`}>
        <h2>
          <a>{issue.title}</a>
        </h2>
      </Link>
    </div>
  );
}

export default function Home({ issues }) {
  return (
    <div>
      <Head>
        <title>515hikaru Diary</title>
        <link rel="icon" href="/favicon.ico" />
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/npm/spcss@0.6.0"
        ></link>
      </Head>

      <main>
        <h1 className={styles.title}>Welcome to @515hikaru's diary!</h1>
        {issues.map((issue) => Artilce(issue.node))}
      </main>

      <footer>
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
  return await fetchDiaryArticles();
};
