const logger = require('../../services/logger.service')
const reviewService = require('./review.service')

// TODO: needs error handling! try, catch

async function getReviews(req, res) {
    try {
        console.log('req.query:', req.query);
        const reviews = await reviewService.query(req.query)
        res.send(reviews)
    } catch (err) {
        logger.error('Cannot get reviews', err);
        res.status(500).send({ error: 'cannot get reviews' })

    }
}

async function deleteReview(req, res) {
    // console.log('req.params.id:', req.params.id);
    const user = req.session.user;
    const review = await reviewService.getById(req.params.id)
    console.log('user in delete review:', user);
    console.log('review from getById:', review);
    if (!user.isAdmin && user._id !== review.byUserId) return;
    else {
        try {
            await reviewService.remove(req.params.id)
            res.end()
        } catch (err) {
            logger.error('Cannot delete review', err);
            res.status(500).send({ error: 'cannot delete review' })
        }
    }
}

async function addReview(req, res) {
    var review = req.body;
    review.byUser = req.session.user;
    review.byUserId = req.session.user._id
    review.toyId = review.aboutToy.toyId
    review = await reviewService.add(review)
    console.log('review in add review:', review);
    res.send(review)
}

module.exports = {
    getReviews,
    deleteReview,
    addReview
}