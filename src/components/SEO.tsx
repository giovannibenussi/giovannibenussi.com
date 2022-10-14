import Head from 'next/head'

type SEOProps = {
  description: string
  title: string
  image: string | null
}

export function SEO(props: SEOProps) {
  return (
    <Head>
      <title>{props.title} | Giovanni Benussi Blog</title>
      <meta name="description" content={props.description} />
      <link rel="icon" href="/favicon.ico" />
      <meta name="og:title" content={props.title} />
      <meta name="og:description" content={props.description} />
      <meta name="og:type" content={`website`} />
      <meta name="og:image" content={props.image || undefined} />
      <meta name="twitter:image" content={props.image || undefined} />
      <meta name="twitter:card" content={`summary_large_image`} />
      <meta
        name="twitter:creator"
        content="https://twitter.com/giovannibenussi"
      />
      <meta name="twitter:title" content={props.title} />
      <meta name="twitter:description" content={props.description} />
    </Head>
  )
}
