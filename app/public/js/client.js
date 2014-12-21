
$(function() {

/* ROUTES */
/* ====== */

// GET / to view a list of news post entries

// GET /news/:id to see a single news post

// each news post should include a link to delete this news post

// each news post should include a link to edit this news post

// GET /new_news to see a "new news post" form

// the form fields are:
// author : Text
// title : Text
// body : TextArea

// POST /news to create a new news post i
$('#share_button').click('submit', function() {
  console.log('share button pressed');
});

// GET /news/:id/edit to see a form to edit a news post identified by the :id param

// the form fields are:
// author : Text
// title : Text
// body : TextArea

// PUT /news/:id updates a single news post identified by the :id param

// DELETE /news/:id to delete a single news post identified by the :id param


});