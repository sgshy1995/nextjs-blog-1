import {GetServerSideProps, GetStaticPaths, GetStaticProps, NextPage} from 'next';
import {getPost, getPostsIds} from '../../lib/posts';
import {getDBConnection} from '../../lib/getDBConnection';
import {Post} from '../../src/entity/Post';
import {UAParser} from 'ua-parser-js';

type Props = {
    post: Post;
}

const PostShow: NextPage<Props> = (props) => {
    const {post} = props;
    return (
        <div>
            <h1>{post.title}</h1>
            <article dangerouslySetInnerHTML={{__html: post.content}}/>
        </div>
    );
};

export default PostShow;

/*
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
};*/

export const getServerSideProps: GetServerSideProps<any,{id:string}> = async (context) => {
    // 获取 connection
    const connection = await getDBConnection()
    const post = await connection.manager.findOne(Post,context.params.id)
    console.log('post',post)

    return {
        props: {
            post: JSON.parse(JSON.stringify(post))
        }
    };
};
