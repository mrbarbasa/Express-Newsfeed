// INIT AND LIBRARIES
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var mongoose = require('mongoose');

var CONNECTION_STRING = 'mongodb://dbadmin:' + process.env.DBPASS + '@ds063170.mongolab.com:63170/newsdb';

// MIDDLEWARE
app.use(express.static('./public'));
app.set('view engine', 'jade');
app.use(bodyParser.urlencoded({ extended: true }));


// MongoLab CONNECTION_STRING
mongoose.connect(CONNECTION_STRING);

var newsSchema = mongoose.Schema({
  title: String,
  author: String,
  body: String
});

var NewsItem = mongoose.model('New', newsSchema);

// ROUTES
app.get('/', function(req, res) {
  var locals = {
    newsContent: [
      {
        "author": "Marc Canter",
        "title": "The Internet Of Things Is Not A Shiny New Toy",
        "body": "The Internet of Things is the latest, greatest new buzzword du jour and every major technology company, industrial manufacturer, big retailer and health industry player has declared the IoT to be the next big thing. Each of these industries sees a way of taking advantage of tiny low-power intelligent devices or sensors and they’ve baked the IoT into their future product strategies."
      },
      {
        "author": "John Biggs",
        "title": "Hands On With The Blackberry Classic",
        "body": "It’s been a long time coming: Blackberry’s return to its roots. Rather than chasing the pack, Blackberry has brought back exactly what its fans have been wanting in a package that is usable, fun, and solid. But can it save the company? I’m a fan of the $450 Classic and will post a full review on Monday but until then I’ve prepared a brief hands on."
      },
      {
        "author": "Alison Derbenwick Miller",
        "title": "Transforming The Conversation On Women In Computer Science",
        "body": "Barbie and Mattel made news recently in the world of computer science. While initial reaction to Mattel’sBarbie “I Can Be a Computer Engineer” book focused on all-too-common and inaccurate stereotypes, conversation that has developed around the book is actually helping to shine the spotlight on two very important issues."
      },
      {
        "author": "Anne Altman",
        "title": "How Mobile And Social Feeds Government’s Appetite For Innovation",
        "body": "Editor’s note: Anne Altman is the general manager of IBM U.S. Federal and Government Industries. Applications that simply deliver information can be useful, but government agencies are now pushing user engagement to new heights."
      },
      {
        "author": "Travis Bernard",
        "title": "11 Stories You Don’t Want To Miss This Week",
        "body": "From the Sony hack coverage to Instagram being valued at $35 billion, here are the top stories from 12/13-12/19. 1. Sony was hacked. Sony cancels the theatrical release of The Interview after threats from hackers. The FBI blames North Korea for the hack."
      },
      {
        "author": "Frederic Lardinois",
        "title": "North Korea On Sony Hack: It Wasn’t Us",
        "body": "Here is the latest twist in the ongoing Sony hacking story: after the FBI alleged that North Korea was indeed behind the attack on Sony, North Korea today categorically denied having anything to do with it. According to a BBC report, North Korea’s foreign ministry went as far threatening “grave consequences” and demanding a joint investigation into the allegations."
      },
      {
        "author": "Natasha Lomas",
        "title": "Stichy Makes It Easier For Groups To Curate And Share Mobile Media",
        "body": "Rumr Inc, a mobile messaging focused startup which last year raised an $800,000 seed, led by Khosla Ventures‘ Ben Ling, to fund a series of projects, has now launched its third app — called Stichy — this one focused on sharing multimedia content within groups."
      },
      {
        "author": "Jon Evans",
        "title": "Why Is Yahoo Still So Bad At The Basics?",
        "body": "I’m reluctant to cite what I’m about to cite. It’s scathing. It’s scurrilous. It’s caustic criticism that seems often overblown and, in some cases, deliberately devoid of context."
      },
      {
        "author": "John Biggs",
        "title": "Reddit Announces RedditNotes, A Way To Share Equity With Readers",
        "body": "Reddit, the world’s favorite repository for funny and/or pornographic images (and wide-ranging discussions on almost any topic), has announced a RedditNotes initiative, a method to give equity to the site’s readers using a lottery method."
      }
    ]
  };

  res.render('./index', locals);
});

// EXPORT THIS FILE AS A MODULE
module.exports.app = app;
