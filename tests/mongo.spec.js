const Database = require('../mongo');

describe("Mock Mongo Unit Tests", () => {
    it("should find nothing if the collection is empty", () => {
        const db = new Database();

        db.collection("test").find({}).toArray((err, data) => {
            expect(data).toHaveLength(0);
        });
    })

    it("should insert an item with a random ID", async (done) => {
        let db = new Database();

        await db.collection("test").insert({name: "blah"});

        db.collection("test").find({name: "blah"}).toArray((err, data) => {
            expect(data).toHaveLength(1)
        
            done();
        })
    });

    it("should insert an item with a random ID using insertOne", async (done) => {
        let db = new Database();

        await db.collection("test").insertOne({name: "blah"});

        db.collection("test").find({name: "blah"}).toArray((err, data) => {
            expect(data).toHaveLength(1)
        
            done();
        })
    });


    it("should upsert an item that doesn't exist on update", async (done) => {
        let db = new Database();

        await db.collection("test").updateOne({_id: "123"}, {$set: { _id: "123", name: "test" }});

        db.collection("test").find({}).toArray((err, data) => {
            expect(data).toHaveLength(1);
        });

        db.collection("test").find({_id: "1234", name: "test"}).toArray((err, data) => {
            expect(data).toHaveLength(0);
        });

        db.collection("test").find({_id: "123", name: "test"}).toArray((err, data) => {
            expect(data).toHaveLength(1);
        });

        done();
    })

    it("should update a preexisting item", async (done) => {
        let db = new Database();

        await db.collection("test").updateOne({_id: "123"}, {$set: { _id: "123", name: "test" }});

        db.collection("test").find({_id: "123"}).toArray((err, data) => {
            expect(data).toHaveLength(1);
        });        
        
        await db.collection("test").updateOne({_id: "123"}, {$set: { _id: "1234", name: "test" }});

        db.collection("test").find({_id: "123"}).toArray((err, data) => {
            expect(data).toHaveLength(0);
        });

        db.collection("test").find({_id: "1234"}).toArray((err, data) => {
            expect(data).toHaveLength(1);
        });

        done();
    })

    it("should find an ID with projection", async (done) => {
        const db = new Database();

        await db.collection("test").insert({name: "blah"});
        await db.collection("test").insert({name: "blah2"});

        db.collection("test").find({name: "blah"}, { projection: { name: 0 }}).toArray((err, data) => {
            expect(data).toHaveLength(1);
            expect(data[0]._id).not.toBe(undefined);
            expect(data[0].name).toBe(undefined)
        });

        db.collection("test").find({name: "blah2"}).project({name: 0}).toArray((err, data) => {
            expect(data).toHaveLength(1);
            expect(data[0]._id).not.toBe(undefined);
            expect(data[0].name).toBe(undefined)
        });

        db.collection("test").find({}).project({name: 1}).toArray((err, data) => {
            expect(data).toHaveLength(2);
            expect(data[0]._id).not.toBe(undefined);
            expect(data[0].name).not.toBe(undefined);
            expect(data[1]._id).not.toBe(undefined);
            expect(data[1].name).not.toBe(undefined);
        });

        done();
    })

    it("should delete an item from the database", async (done) => {
        const db = new Database();

        await db.collection("test").insert({name: "blah"});

        await db.collection("test").remove({name: "blah"})

        db.collection("test").find({name: "blah"}).toArray((err, data) => {
            expect(data).toHaveLength(0);
        });
        
        done();

    })

    it("should delete multiple matching items from the database", async (done) => {
        const db = new Database();

        await db.collection("test").insert({name: "blah", id: "1"});
        await db.collection("test").insert({name: "blah", id: "2"});
        await db.collection("test").insert({name: "aaah", id: "3"});
        await db.collection("test").insert({name: "blah", id: "4"});

        await db.collection("test").remove({name: "blah"})

        db.collection("test").find({name: "blah"}).toArray((err, data) => {
            expect(data).toHaveLength(0);
        });

        db.collection("test").find({name: "aaah"}).toArray((err, data) => {
            expect(data).toHaveLength(1);
            expect(data[0].id).toBe("3");
        });

        done();

    })
})