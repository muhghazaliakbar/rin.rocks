import "@code-hike/mdx/dist/index.css";

import { getLayoutPosts } from "../../components";
import { getBySlug, getContentName, getContents } from "../../src";

import { Heading, SkeletonText, Stack } from "@chakra-ui/react";
import Image from "next/image";
// eslint-disable-next-line
import { useRouter } from "next/router";
import { MDXRemote } from "next-mdx-remote";
import { NextSeo } from "next-seo";

const toPaths = (paths) => ({ paths, fallback: true });
const toProps = ({ meta, content }) => ({ props: { content, meta } });
const toNotfound = (_) => ({ notFound: true });

export const getStaticPaths = () =>
  getContents("./content/posts/")
    .then((files) => files.map((f) => ({ params: { slug: getContentName(f) } })))
    .then(toPaths);

export const getStaticProps = ({ params: { slug } }) => getBySlug(String(slug)).then(toProps).catch(toNotfound);

const Post = ({ content, meta }) => {
  const router = useRouter();

  if (router.isFallback || !content || !meta) {
    return <SkeletonText noOfLines={5} />;
  }

  const img = ({ src, ...props }) => (
    <Image
      alt={src}
      loader={(src_) => {
        return src_.src;
      }}
      sizes="responsive"
      src={require(`../../content/posts/${meta.slug}${src.replace("./", "/")}`)}
      {...props}
    />
  );

  return (
    <>
      <NextSeo title={meta.title} />
      <Heading pb={4} size="2xl">
        {meta.title}
      </Heading>
      <Stack spacing="3">
        <MDXRemote {...content} components={{ img }} />
      </Stack>
    </>
  );
};

Post.defaultProps = {
  content: null,
  meta: null,
};

Post.getLayout = getLayoutPosts;

export default Post;
