import {useEffect, useState} from 'react';
import axios from 'axios';

export const usePosts = () => {
    const [posts, getPosts] = useState<Post[]>([]);
    useEffect(() => {
        axios.get('/api/v1/posts').then(response => {
            getPosts(response.data);
        });
    }, []);
    return {posts, getPosts};
};

