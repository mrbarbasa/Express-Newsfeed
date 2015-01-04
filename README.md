Express-Newsfeed
================

---
## Installation

1. Clone this repo
2. Go to the root directory and run `npm i` and `bower i`
3. Change into the `app` directory and run the following command from cryptobin (ask us for the cryptobin password): https://cryptobin.org/u2b4x093

---

MEH stack - Mongo Express and HTML5 

Use the MEH stack plus *almost* any other library or templating engines you want to fulfill the requirements.  
recommended: sass, jade, mongoose, bower, jQuery, foundation.  
helpful: livereload, gulp for watching compiling sass

---

Create a multi-user News.  
Any user should be able to access these routes:  

- `GET /` to view a list of news post entries
- `GET /news/:id` to see a single news post
  - each news post should include a link to delete this news post
  - each news post should include a link to edit this news post
- `GET /new_news` to see a "new news post" form
  - the form fields are:
    - `author` : Text
    - `title` : Text
    - `body` : TextArea
- `POST /news` to create a new news post i
- `GET /news/:id/edit` to see a form to *edit* a news post identified by the `:id` param
  - the form fields are:
    - `author` : Text
    - `title` : Text
    - `body` : TextArea
- `PUT /news/:id` updates a single news post identified by the `:id` param
- `DELETE /news/:id` to delete a single news post identified by the `:id` param

---

Your app should be stored in subdirectory `/app`.  
The layout of the app must match the layouts included in `/layouts`.  
Match the layout as close as you can, using free and open fonts and graphics.

---

### Layouts

hard because listing and detail pages are so different.  
does not have tablet layout  
uses a background image and font that are not included, you will have to find something similar (subtlepatterns.com)
