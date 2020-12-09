import express from 'express'
import Post from '../../models/post';

const router = express.Router();


router.get('/:searchTerm', async(req, res, next)=>{
    try {
        const result = await Post.find(
            {
                title: {
                    $regex : req.params.searchTerm,
                    $options : "i",
                }
            },
        );
        res.json(result);
    } catch (error) {
        console.error(error)
        next(error)
    }
})

export default router;