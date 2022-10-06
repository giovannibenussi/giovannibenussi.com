import { GetStaticProps } from 'next'
import type { NextPage } from 'next'
import { BlogPostLayout } from 'components/BlogPostLayout'
import { serialize } from 'next-mdx-remote/serialize'
import { MDXRemote } from 'next-mdx-remote'
// @ts-ignore
import remarkPrism from 'remark-prism'
import remarkGFM from 'remark-gfm'
import path from 'path'
//@ts-ignore
import { Chat } from 'components/Chat'
//@ts-ignore
import { InteractiveExample } from 'components/InteractiveExample'
//@ts-ignore
import OutsideVariableMultiple from 'src/blog/a-complete-guide-to-useref/Examples/OutsideVariable/multiple'
//@ts-ignore
import UseCallbackExample from 'src/blog/a-complete-guide-to-useref/Examples/UseCallbackExample'
//@ts-ignore
import UsePreviousExample from 'src/blog/a-complete-guide-to-useref/Examples/UsePreviousExample'
//@ts-ignore
import Base from 'src/blog/polyfill-flex-gap/Base'
//@ts-ignore
import BorderExample from 'src/blog/polyfill-flex-gap/BorderExample'
//@ts-ignore
import CSSVariablesExample from 'src/blog/polyfill-flex-gap/CSSVariablesExample'
//@ts-ignore
import GapExample from 'src/blog/polyfill-flex-gap/GapExample'
//@ts-ignore
import MarginExampleWorking from 'src/blog/polyfill-flex-gap/MarginExampleWorking'
//@ts-ignore
import NestingExample from 'src/blog/polyfill-flex-gap/NestingExample'
//@ts-ignore
import SpaceBetweenItemsExample from 'src/blog/polyfill-flex-gap/SpaceBetweenItemsExample'
//@ts-ignore
import Warning from 'components/Warning'
import CanIUse from 'components/CanIUse'

function removeSuffix(text: string, suffix: string): string {
  return text.endsWith(suffix) ? text.slice(0, -suffix.length) : text
}

function removePrefix(text: string, prefix: string): string {
  return text.startsWith(prefix) ? text.slice(prefix.length) : text
}

export function pageSlug(page: string): string {
  return removeSuffix(removePrefix(page, 'src/blog/'), '/index.mdx')
}

// fg needs to be a parameter, otherwise fs can't be resolved.
export async function getAllMDXFiles(fg: any): Promise<string[]> {
  return fg('src/blog/**/index.mdx', { cwd: process.cwd() })
}

export async function getStaticPaths() {
  const fg = require('fast-glob')
  let paths = await getAllMDXFiles(fg)
  paths = paths.map((path) => {
    path = require('path').dirname(path)
    path = removePrefix(path, 'src')
    return path
  })
  return { paths, fallback: false }
}

type Params = {
  slug: string
}

export const getStaticProps: GetStaticProps<any, Params> = async (context) => {
  const fs = require('fs')
  const { slug } = context.params || {}
  const articlesPath = path.join(process.cwd(), 'src/blog')
  const articleDir = path.join(articlesPath, `${slug}/index.mdx`)

  const source = fs.readFileSync(articleDir)
  const mdxSource = await serialize(source.toString(), {
    mdxOptions: {
      remarkPlugins: [remarkPrism, remarkGFM],
    },
    parseFrontmatter: true,
  })

  return { props: { mdxSource } }
}

type BlogEntryProps = {
  mdxSource: any
}

const components = {
  Chat,
  InteractiveExample,
  OutsideVariableMultiple,
  UseCallbackExample,
  UsePreviousExample,
  Base,
  BorderExample,
  CSSVariablesExample,
  GapExample,
  MarginExampleWorking,
  NestingExample,
  SpaceBetweenItemsExample,
  Warning,
  CanIUse,
}

const BlogEntry: NextPage<BlogEntryProps> = ({ mdxSource }) => {
  return (
    <BlogPostLayout frontmatter={mdxSource.frontmatter}>
      <MDXRemote {...mdxSource} components={components} />
    </BlogPostLayout>
  )
}

export default BlogEntry
