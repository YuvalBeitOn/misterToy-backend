const toyService = require('./toy.service')
    // const logger = require('../../services/logger.service')

async function getToy(req, res) {
    const toy = await toyService.getById(req.params.id)
    res.send(toy)
}

async function getToys(req, res) {
    // console.log('filterBy:', req.query);
    const toys = await toyService.query(req.query)
        // logger.debug(toys);
    res.send(toys)
}

async function deleteToy(req, res) {
    console.log('req.session.user workkkkkkkkkkk?', req.session.user);
    if (req.session.user.isAdmin) {
        await toyService.remove(req.params.id)
        res.end()
    } else return
}

async function updateToy(req, res) {
    console.log('req.session.user workkkkkkkkkkk?', req.session.user);

    if (req.session.user.isAdmin) {
        const toy = req.body;
        await toyService.save(toy)
        res.send(toy)
    } else return
}

module.exports = {
    getToy,
    getToys,
    deleteToy,
    updateToy
}