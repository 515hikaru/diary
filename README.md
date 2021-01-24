# diary
GitHub Issues の Issue ひとつを日記にする試み

# 仕組み

Next.js を静的サイトジェネレータとして使っています。ビルド時に GitHub の GraphQL API を叩くことで GitHub Issues から記事を取得しています。

ビルドしたページは Vercel にデプロイしています。 https://515hikaru-diary.vercel.app/

# 内容

毎日の振り返りを記述しています。

# デプロイ頻度

ブログのデザインや、記事のページの取得ロジックの変更など、ソースコードに変更があれば即時でデプロイされます。

また、毎日 23 時 23 分にデプロイします。
