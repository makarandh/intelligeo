db = db.getSiblingDB("geo")
db.tempCollection.insertOne({"empty": "document"})
db.tempCollection.drop()

db = db.getSiblingDB("geo")
db.createUser({
    user: "geo",
    pwd: _getEnv("GEO_PASS"),
    roles: [{
        role: "dbAdmin",
        db: "geo"
    },
    {
        role: "readWrite",
        db: "geo"
    }]
})
