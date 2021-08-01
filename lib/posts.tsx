import path from 'path';
import fs, {promises as fsp} from 'fs';
import matter from 'gray-matter';
import marked from 'marked';

const markdownDir = path.join(process.cwd(), 'markdown');

export const getPosts = async () => {
    const fileNames = await fsp.readdir(markdownDir);
    const fileList = fileNames.map(fileName => {
        const fullPath = path.join(markdownDir, fileName);
        const id = fileName.replace(/\.md$/g, '');
        console.log('fullPath', fullPath);
        const text = fs.readFileSync(fullPath, 'utf-8');
        const result = matter(text);
        const {data: {title, date}, content} = result;
        return {
            id,
            title,
            date
        };
    });
    return fileList;
};

export const getPost = async (id: string | string[] | undefined) => {
    const fullPath = path.join(markdownDir, id + '.md');
    const text = fs.readFileSync(fullPath, 'utf-8');
    const result = matter(text);
    const {data: {title, date}, content} = result;
    const htmlContent = marked(content)
    return JSON.parse(JSON.stringify({
        id,
        title,
        date,
        content,
        htmlContent
    }));
};

export const getPostsIds = async () => {
    const fileNames = await fsp.readdir(markdownDir);
    return fileNames.map(fileName=>{
        return {
            params: {
                id: fileName.replace(/\.md$/,'')
            }
        }
    })
}