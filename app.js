import express from "express";
import mongoose from "mongoose";
import ejs from "ejs";
import bodyParser from "body-parser";


const app = express();

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(express.json());



mongoose.connect(
  "mongodb+srv://ahmad:happy123@cluster0.cqo03de.mongodb.net/wikiDB?retryWrites=true&w=majority"
);
const articleSchema = {
  title: String,
  content: String
}
const Article = mongoose.model("Article", articleSchema);

/////////////////// REQUEST TARGETING ALL ARTICLES /////////////////////


app.route("/articles")

  .get((req, res) => {

    Article.find({})
      .then(foundArticles => {
        res.send(foundArticles);
      })
      .catch(err => {
        console.error(err);
      })
  })


  .post((req, res) => {

    const article = new Article({
      title: req.body.title,
      content: req.body.content
    });

    article.save()
      .then((result) => {
        console.log('Article saved:', result);
      })
      .catch((error) => {
        console.error('Error saving article:', error);
      });

  })


  .delete((req, res) => {
    Article.deleteMany({})
      .then((result) => {
        console.log(`${result.deletedCount} documents deleted`);
      })
      .catch((error) => {
        console.error('Error deleting documents:', error);
      });
  });



/////////////////// REQUEST TARGETING SINGLE ARTICLE /////////////////////


app.route("/articles/:articleTitle")
  .get((req,res) => {
    Article.findOne({title: req.params.articleTitle})
      .then((foundArticle) => {
        res.send(foundArticle);
      })
      .catch((error) => {
        console.error('Article not found: ', error);
      });
    
  })

  .put( (req, res) => {
    const filter = { title: req.params.articleTitle };
    const update = { title: req.body.title, content: req.body.content };
  
    Article.findOneAndUpdate(filter, update)
      .then((result) => {
        res.send('Successfully updated the article');
        console.log(result);
      })
      .catch((error) => {
        console.error('Update unsuccessful:', error);
        res.status(500).send('An error occurred');
      });
  })


  .patch( (req, res) => {
    const filter = { title: req.params.articleTitle };
    const update = { ...req.body };
  
    Article.findOneAndUpdate(filter, update)
      .then((result) => {
        res.send('Successfully updated the article');
        console.log(result);
      })
      .catch((error) => {
        console.error('Update unsuccessful:', error);
        res.status(500).send('An error occurred');
      });
  })

  .delete((req, res) => {
    const articleTitle = req.params.articleTitle;

  Article.findOneAndDelete({ title: articleTitle })
    .then((deletedArticle) => {
      if (deletedArticle) {
        res.send('Article deleted successfully');
      } else {
        res.status(404).send('Article not found');
      }
    })
    .catch((error) => {
      console.error('Delete unsuccessful:', error);
      res.status(500).send('An error occurred');
    });
  })





app.listen("3000", () => {
  console.log("Spinning on port 3000");
});