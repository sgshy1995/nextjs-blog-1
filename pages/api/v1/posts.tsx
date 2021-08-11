import {NextApiHandler} from 'next';
import {getPosts} from 'lib/posts';
import {getDBConnection} from 'lib/getDBConnection';
import {Post} from 'src/entity/Post';
import {withSession} from 'lib/withSession';

const Posts: NextApiHandler = withSession(async (req, res) => {
    console.log('method',req.method)
    if (req.method==='GET'){
        const fileList = await getPosts();
        console.log('fileList', fileList);
        res.status(200)
            .setHeader('Content-Type', 'application/json');
        res.json(fileList);
        res.end();
    }else if (req.method==='POST'){
        const {title,content} = req.body
        const connection = await getDBConnection()
        const post = new Post()
        post.title = title
        post.content = content
        post.author = req.session.get('currentUser');
        await connection.manager.save(post)
        res.status(200)
            .setHeader('Content-Type', 'application/json');
        res.json({
            code: 200,
            message: '创建成功',
            status: true
        })
        res.end();
    }
});

export default Posts;