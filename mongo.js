/** @module MongoDB */

/**
 * @callback basicThenCallback - What happens once the then is called
 * @param {string} err - Handles error
 * @param {string} res - Database result 
 */

class Database {
    /**
     * Creates a mock MongoDB Server
     * @constructor
     */
    constructor() {
        this.data = []
    }

    /**
     * Set the collection for a query.
     * @param {string} collection - Collection name 
     * @return {this}
     */
    collection(collection) {
        this.collectionName = collection;
        return this;
    }

    /**
     * Query a database to find items
     * @param {Object} query - Database query
     * @param {Object=} settings - Things like projection
     */
    find(query, settings = {}) {
        if(JSON.stringify(query) != "{}") {
            this.returnData = JSON.parse(JSON.stringify(this.data.filter(obj => {
                let ret = true;
                for(let key in query) {
                    if(obj[key] != query[key]) {
                        ret = false;
                        break;
                    }
                }
                return ret;
            })))
        } else {
            if(this.data.length > 0) {
                this.returnData = JSON.parse(JSON.stringify(this.data));
            } else {
                this.returnData = []
            }
        }

        if(settings != undefined && settings.projection != undefined) {
            this.project(settings.projection);
        }

        return this;
    }

    /**
     * Used for some testing purposes
     * @param {basicThenCallback} cb
     * @returns {void}
     */
    then(cb) {
        cb(this.returnData);
    }

    /**
     * Removes certain items from a response
     * @param {Object} projection - Projection query object
     */
    project(projection) {
        for(let i in this.returnData) {
            for(let project in projection) {
                if(projection[project] == false) {                    
                    Object.keys(this.returnData[i]).filter(key => key == project).forEach(key => delete this.returnData[i][key])
                }
            }
        }
        return this;
    }

    /**
     * Converts found query items into an array
     * @param {basicThenCallback} cb
     * @returns {this} 
     */
    toArray(cb) {
        const data = this.returnData;
        this.returnData = [];
        cb(undefined, data);

        return this;
    }

    /**
     * Insert an item into the database
     * @async
     * @param {Object} item - New item to be inserted
     * @returns {Promise} - Promise object represents the inserted objects ID
     */
    async insert(item) {
        return new Promise((resolve, reject) => {
            item._id = item._id || Math.floor(Math.random() * 100000) + 1000;
            this.data.push(item);

            resolve({_id: item._id});
        })
    }

    /**
     * Same as insert()
     * @async
     * @param {Object} item
     * @returns {Promise} - Promise object represents the inserted objects ID 
     */
    async insertOne(item) {
        return await this.insert(item);
    }

    /**
     * 
     * @param {Object} oldItem - Old item to be replaced 
     * @param {Object} newItem - New item to replace old item
     * @param {Object=} settings - TBD
     * @param {basicThenCallback=} cb 
     */
    async updateOne(oldItem, newItem, settings, cb = () => {}) {
        return new Promise((resolve, reject) => {
            if(this.data.findIndex(u => u._id == oldItem._id) == -1) {
                this.insert(newItem["$set"]);
            } else {
                this.data[this.data.findIndex(u => u._id == oldItem._id)] = newItem["$set"];            
            }
            
            cb(undefined, newItem["$set"]);
            resolve(this);
        })
    }

    /**
     * Removes item(s) from database
     * @param {Object} query
     */
    async remove(query) {
        return new Promise((resolve, reject) => {
            if(JSON.stringify(query) != "{}") {
                this.data = this.data.filter(obj => {
                    let ret = true;
                    for(let key in query) {
                        if(obj[key] == query[key]) {
                            ret = false;
                            break;
                        }
                    }
                    return ret;
                })
            }
            resolve(this);
        })
    }

}

module.exports = Database;