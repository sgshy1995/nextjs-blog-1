import {NextApiHandler} from 'next';
import {getPosts} from 'lib/posts';

const Posts: NextApiHandler = async (req, res) => {
    const fileList = await getPosts();
    console.log('fileList', fileList);
    res.status(200)
        .setHeader('Content-Type', 'application/json')
        .json(fileList);
    res.end();
};

export default Posts;