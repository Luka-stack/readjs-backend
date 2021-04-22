import { Request, Response, Router } from "express";
import Post from "../entities/Post";
import Sub from "../entities/Sub";

import auth from '../middleware/auth';


const createPost = async (req: Request, res: Response) => {
    
    const { title, body, subName } = req.body;
    const user = res.locals.user;

    if (title.trim() == '') {
        return res.status(400).json({ title: 'Title must not be empty' });
    }

    try {
        const sub = await Sub.findOneOrFail({ name: subName });

        const post = new Post({ title, body, user, sub });
        await post.save()

        return res.json(post);
    } 
    catch (error) {
        console.log(error);
        return res.status(500).json({ error: 'Something went wrong' });
    }
}

const router = Router();

router.post('/', auth, createPost);

export default router;