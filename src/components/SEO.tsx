import Head from 'next/head'

type SEOProps = {
  description:string
  title: string
}

export function SEO(props: SEOProps) {
  return (
    <Head>
      <title>{props.title} | Giovanni Benussi Blog</title>
      <meta name="description" content={props.description} />
      <link rel="icon" href="/favicon.ico" />
    </Head>
  )
}
