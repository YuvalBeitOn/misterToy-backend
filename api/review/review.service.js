const dbService = require('../../services/db.service')
const ObjectId = require('mongodb').ObjectId


function _buildCriteria(filterBy) {
    console.log('filterBy in build criteria:', filterBy, '>>>>>>>>>>>>>>>>>>>');
    const criteria = {};
    if (filterBy.toyId) {
        criteria.toyId = filterBy.toyId
    }
    if (filterBy.byUser) {
        criteria.byUserId = filterBy.byUser
    }
    return criteria;
}

async function query(filterBy = {}) {
    // TODO: Build the criteria with $regex
    const criteria = _buildCriteria(filterBy)
    console.log('criteria in query:', criteria);
    const collection = await dbService.getCollection('review')
        // console.log('collection:', collection);
    try {
        let reviews = await collection.find(criteria).toArray();
        console.log('reviews before delete:', reviews, '>>>>>>>>>>>');
        reviews = reviews.map(review => {
            delete review.byUser.userId;
            delete review.aboutToy.toyId;
            return review;
        })
        return reviews
    } catch (err) {
        console.log('ERROR: cannot find reviews', err)
        throw err;
    }
}

async function remove(reviewId) {
    const collection = await dbService.getCollection('review')
    try {
        await collection.deleteOne({ "_id": ObjectId(reviewId) })
    } catch (err) {
        console.log(`ERROR: cannot remove review ${reviewId}`)
        throw err;
    }
}


async function add(review) {
    review.aboutToy.toyId = ObjectId(review.aboutToy.toyId);
    review.byUser.userId = ObjectId(review.byUser.userId);
    const collection = await dbService.getCollection('review')
    try {
        await collection.insertOne(review);
        return review;
    } catch (err) {
        console.log(`ERROR: cannot insert user`)
        throw err;
    }
}

module.exports = {
    query,
    remove,
    add
}