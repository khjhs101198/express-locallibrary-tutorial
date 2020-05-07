var BookInstance = require('../models/bookinstance');
var Book = require('../models/book');
const { body, validationResult} = require('express-validator/check');
const { sanitizeBody } = require('express-validator/filter');

// Display list of all BookInstances.
exports.bookinstance_list = function(req, res, next) {

  BookInstance.find()
    .populate('book')
    .exec(function (err, list_bookinstances) {
      if (err) { return next(err); }
      // Successful, so render
      res.render('bookinstance_list', { title: 'Book Instance List', bookinstance_list: list_bookinstances });
    });
    
};

// Display detail page for a specific BookInstance.
exports.bookinstance_detail = function(req, res, next) {
    BookInstance.findById(req.params.id)
	.populate('book')
	.exec(function(err, bookinstance) {
		if (err) { return next(err);}
		if (bookinstance === null) {
			var err = new Error('Book copy not found');
			err.status = 404;
			return next(err);
		}
	    //Successful, so render.
		res.render('bookinstance_detail', { title: 'Copy: '+bookinstance.book.title, bookinstance:  bookinstance});
	})
};

// Display BookInstance create form on GET.
exports.bookinstance_create_get = function(req, res, next) {
    //從Book裡面，搜尋所有title的資料，再把結果透過exec傳到函數裡
	Book.find({}, 'title')
	.exec(function(err, books) {
		if(err) { return next(err);}
		res.render('bookinstance_form', {title: 'Create Bookinstance', book_list: books})
	});
};

// Handle BookInstance create on POST.
exports.bookinstance_create_post = [
    body('book', 'Book must be specified').trim().isLength({ min: 1}),
    body('imprint', 'Imprint must be specified').trim().isLength({ min: 1}),
    body('due_back', 'Invalid date').optional({ checkFalsy: true}).isISO8601(),
	
	sanitizeBody('book').escape(),
	sanitizeBody('imprint').escape(),
	sanitizeBody('status').trim().escape(),
	sanitizeBody('due_back').toDate(),
	
	(req, res, next) => {
		const errors = validationResult(req);
		var bookinstance = new BookInstance(
		    {
				book: req.body.book,
				imprint: req.body.imprint,
				due_back: req.body.due_back,
				status: req.body.status
			}
		);
		
		if(!error.isEmpty()) {
			Book.find({}, 'title')
			.exec(function(err, books) {
				if(err) { return next(err);}
				res.render('bookinstance_form', {title: 'Create BookInstance', book_list: books, selected_book: bookinstance.book._id, errors: errors.array(), bookinstance: bookinstance})
			});
			return;
		}
		else {
			bookinstance.save(function(err) {
				if(err) { return next(err);}
				res.redirect(bookinstance.url);
			});
		}
	}
];

// Display BookInstance delete form on GET.
exports.bookinstance_delete_get = function(req, res) {
    res.send('NOT IMPLEMENTED: BookInstance delete GET');
};

// Handle BookInstance delete on POST.
exports.bookinstance_delete_post = function(req, res) {
    res.send('NOT IMPLEMENTED: BookInstance delete POST');
};

// Display BookInstance update form on GET.
exports.bookinstance_update_get = function(req, res) {
    res.send('NOT IMPLEMENTED: BookInstance update GET');
};

// Handle bookinstance update on POST.
exports.bookinstance_update_post = function(req, res) {
    res.send('NOT IMPLEMENTED: BookInstance update POST');
};