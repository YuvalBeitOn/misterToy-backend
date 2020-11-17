const fs = require('fs')
const toysJson = require('../data/db.json')

// const defaultToys = []

// const gToys = (toysJson.length) ? toysJson : defaultToys

const gToys = toysJson;

_saveToysToFile()

module.exports = {
    query,
    getById,
    save,
    remove
}

function query(filterBy) { //filter here
    let res = JSON.parse(JSON.stringify(gToys));
    if (filterBy._sort) {
        let compareFunc = filterBy._sort === 'name' ? _sortByName : _sortByPrice
        res = res.sort(compareFunc)
            // console.log('res after sort:', res);
    }
    if (filterBy.inStock) {
        res = res.filter(toy => toy.inStock)
    }
    if (filterBy.type) {
        res = res.filter(toy => toy.type === filterBy.type)
    }
    return Promise.resolve(res)
}

function _sortByPrice(a, b) {
    if (a.price > b.price) {
        return 1;
    }
    if (a.price < b.price) {
        return -1;
    }
    return 0;

}

function _sortByName(a, b) {
    if (a.name > b.name) {
        return 1;
    }
    if (a.name < b.name) {
        return -1;
    }
    return 0;

}

function getById(toyId) {
    const toy = gToys.find(toy => toy._id === +toyId)
    console.log('toy by id:', toy);
    return Promise.resolve(toy)
}


function remove(toyId) {
    const idx = gToys.findIndex(toy => toy._id === toyId)
    if (!gToys.length) gToys = JSON.parse(JSON.stringify(defaultToys));
    gToys.splice(idx, 1)
    _saveToysToFile()
    console.log('removing toy:', idx);
    return Promise.resolve(gToys)
}

function save(toy) {
    if (toy._id) { // update

        console.log('updating toy');
        const idx = gToys.findIndex(currtoy => currtoy._id === toy._id)
        gToys.splice(idx, 1, toy)
        toy.updateAt = Date.now()
    } else { // create
        toy._id = _makeId()
        toy.createdAt = Date.now()
        gToys.unshift(toy)
    }
    _saveToysToFile()
    return Promise.resolve(toy)
}

function _makeId(length = 4) {
    var txt = ''
    var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
    for (let i = 0; i < length; i++) {
        txt += possible.charAt(Math.floor(Math.random() * possible.length))
    }
    return txt
}

function _saveToysToFile() {
    fs.writeFileSync('data/db.json', JSON.stringify(gToys, null, 2))
}