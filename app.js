const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require("body-parser")
const ejs = require("ejs");

const app = express();
app.set("view engine",'ejs');
app.use(bodyParser.urlencoded({
  extended : true
}));
app.use(express.static("public"));

// mongoose.connect("mongodb://127.0.0.1:27017/wikiDB",{useNewUrlParser : true});
mongoose.connect("mongodb+srv://shreyashgawande48:Shreyash8902@cluster0.hukbecs.mongodb.net/wikiDB",{useNewUrlParser : true});

const articleSchema = {
  title: String,
  content : String
};
const Article = mongoose.model("Article",articleSchema);

app.route("/articles")
.get(function(req,res){
  Article.find({},function(err,foundArticles){
    // console.log(foundArticles);
    if(!err){
    res.send(foundArticles);
  }
  else{
    res.send(err);
  }
  });

})
.post(function(req,res){
  // console.log(req.body);
  if(!req.body.title || !req.body.content){
    res.send("Some data is missing");
  }
  else{
  const article = new Article({
    title : req.body.title,
    content: req.body.content
  });
 
  article.save(function(err){
    if(!err){
      res.send("Successfully added a new article ");
    }
    else{
      res.send(err);
    }
  });
  }
})
.delete(function(req,res){
  Article.deleteMany({},function(err){
    if(!err){
      res.send("Successfully deleted all articles from database.");
    }
    else{
      res.send(err);
    }
  });
});

app.route("/articles/:articleTitle").get(function(req,res){
  Article.findOne({title : req.params.articleTitle },function(err,foundArticle){
    if(foundArticle){
      res.send(foundArticle);
    }else{
      res.send("No Result Found");
    }
  });
} )
.put(function(req,res){
  Article.updateOne({title:req.params.articleTitle},{$set:{
    title:req.body.title,
    content:req.body.content
  }},{overwrite:true},function(er){
    res.send("Successfully Updated");
  });
})
.patch(function(req,res){
  Article.updateOne({title:req.params.articleTitle},{$set:{
    title:req.body.title,
    content:req.body.content
  }},{overwrite:true},function(er){
    res.send("Successfully Updated");
  });
})
.delete(function(req,res){
  Article.deleteOne({title: req.params.articleTitle},function(err){
    if(!err){
      res.send("Successfully deleted the requested article .");
    }
    else{
      res.send(err);
    }
  });
});


app.listen(3500,function(){
  console.log("Server is running on localhost 3500");
});
