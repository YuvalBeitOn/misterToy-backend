const dbService = require('../../services/db.service')
    // const reviewService = require('../review/review.service')
const ObjectId = require('mongodb').ObjectId

module.exports = {
    query,
    getById,
    save,
    remove
}

async function query(filterBy) { //filter here
    const collection = await dbService.getCollection('toy')
        // console.log('collection in toy query:', collection);
    const criteria = _buildCriteria(filterBy);
    // console.log('criteria in toy query:', criteria);
    try {
        let sortObj = (filterBy._sort === 'name') ? { name: 1 } : { price: 1 }
        const toys = await collection.find(criteria).sort(sortObj).toArray()
        return toys
    } catch (err) {
        console.log('ERROR: cannot find toys')
        throw err;

    }
}

function _buildCriteria(filterBy) {
    const criteria = {};
    if (filterBy.type) {
        criteria.type = filterBy.type
    }
    if (filterBy.inStock) {
        criteria.inStock = true;
    }
    return criteria;
}

async function getById(toyId) {
    const collection = await dbService.getCollection('toy')
    try {
        const toy = await collection.findOne({ '_id': ObjectId(toyId) })
        return toy

    } catch (err) {
        console.log(`ERROR: while finding toy ${toyId}`)
        throw err;
    }
}


async function remove(toyId) {
    const collection = await dbService.getCollection('toy')

    try {
        await collection.deleteOne({ '_id': ObjectId(toyId) })
    } catch (err) {
        console.log(`ERROR: cannot remove toy ${toyId}`)
        throw err;
    }
}


async function save(toy) {
    const collection = await dbService.getCollection('toy')
    const id = toy._id
    if (toy._id) { // update
        try {
            toy.updateAt = Date.now()
            delete toy._id
            await collection.replaceOne({ _id: ObjectId(id) }, toy)
            toy._id = id
            return toy
        } catch (err) {
            console.log(`ERROR: cannot update toy ${toy._id}`)
            throw err;
        }
    } else { // create
        try {
            toy.createdAt = Date.now() // ok?
            await collection.insertOne(toy);
            return toy;
        } catch (err) {
            console.log(`ERROR: cannot insert toy`)
            throw err;
        }
    }
}