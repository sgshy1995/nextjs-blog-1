import {GetStaticProps, NextPage} from 'next';
import React from 'react';
import {getPosts} from 'lib/posts';
import Link from 'next/link';
import Home from '../index';
import dynamic from 'next/dynamic'

const DynamicComponent = dynamic(() => import('../index'))

type Props = {
    posts: Post[];
}

const PostsIndex: NextPage<Props> = (props) => {
    console.log('posts props',props)
    const {posts} = props
    return (
        <Home innerPage={<React.Fragment>
            <div>文章列表</div>
            <div className="posts-wrapper">
                {
                    posts.map(p => <div key={p.id}>
                        <Link href="/posts/[id]" as={`/posts/${p.id}`}>
                            <a>{p.id}</a>
                        </Link>
                        <span>{p.title}</span>
                        <span>{p.date}</span>
                    </div>)
                }
            </div>


        </React.Fragment>}>

        </Home>

    );
};

export default PostsIndex;

export const getStaticProps:GetStaticProps = async ()=>{
    const posts = await getPosts()
    return {
        props: {
            posts: JSON.parse(JSON.stringify(posts))
        }
    }
}