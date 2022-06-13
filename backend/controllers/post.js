const Post = require("../models/Post");
const User = require("../models/User");
exports.createPost = async (req,res) => {
    try {
        
        const newPostData = {
            caption:req.body.caption,
            image:{
                public_id:"req.body.public_id",
                url:"req.body.url",
            },

            owner:req.user._id,
        };

        const newPost = await Post.create(newPostData);

        const user = await User.findById(req.user._id);

        user.posts.push(newPost._id);   //newpost id pushed into posts array

        res.status(201).json({
            success:true,
            post: newPost,
        })


    } catch (error) {
        res.status(500).json({
            success:false,
            message:error.message
        })
    }
}

exports.deletePost = async (req, res) => {
    try {
      const post = await Post.findById(req.params.id);
  
      if (!post) {
        return res.status(404).json({
          success: false,
          message: "Post not found",
        });
      }
  
      if (post.owner.toString() !== req.user._id.toString()) {    // checking owner==post deleting user
        return res.status(401).json({
          success: false,
          message: "Unauthorized",
        });
      }
  
    //   await cloudinary.v2.uploader.destroy(post.image.public_id);
  
      await post.remove();
  
      const user = await User.findById(req.user._id);
  
      const index = user.posts.indexOf(req.params.id);
      user.posts.splice(index, 1);
  
      await user.save();
  
      res.status(200).json({
        success: true,
        message: "Post deleted",
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  };


exports.likeAndUnlikePost = async (req,res)=>{
    try {

        const post = await Post.findById(req.params.id);

        if(!post){
            return res.status(404).json({
                success:false,
                message:"Post not Found",
            })
        }
       if(post.likes.includes(req.user._id)) {    //unlike
            const index = post.likes.indexof(req.user._id);
            post.likes.splice(index,1);

            await post.save();

            return res.status(200).json({
                success:true,
                message:"Post Unliked",
            })
       }

       else{
        post.likes.push(req.user._id);    // like

        await post.save();

        return res.status(200).json({
            success:true,
            message:" Post Liked",
        })


       }

       
        
    } catch (error) {
        res.status(500).json({
            success:false,
            message: error.message,
        })
    }
}

