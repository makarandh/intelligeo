db = db.getSiblingDB("geo")
db.tempCollection.insertOne({"empty": "document"})

db.createUser({
    user: "geo",
    pwd: "geo",
    roles: [{
        role: "dbAdmin",
        db: "geo"
    },
    {
        role: "readWrite",
        db: "geo"
    }]
})
