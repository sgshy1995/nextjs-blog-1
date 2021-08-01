import {GetStaticPaths, GetStaticProps, NextPage} from 'next';
import {getPost, getPostsIds} from '../../lib/posts';

type Props = {
    post: Post;
}

const PostShow: NextPage<Props> = (props) => {
    const {post} = props;
    return (
        <div>
            <h1>{post.title}</h1>
            <article dangerouslySetInnerHTML={{__html: post.htmlContent}}/>
        </div>
    );
};

export default PostShow;

export const getStaticPaths: GetStaticPaths = async () => {
    const ids = await getPostsIds();
    return {
        paths: ids,
        fallback: true
    };
};

export const getStaticProps: GetStaticProps = async (context) => {
    const id: string | string[] | undefined = context.params!.id;
    const post = await getPost(id);
    return {
        props: {
            post
        }
    };
};