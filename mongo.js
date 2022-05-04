console.clear()

const mongoose = require('mongoose')
require('dotenv').config()

console.log('argv:', process.argv.length)

/*if (process.argv.length < 3) {
  console.log('Please provide the password as an argument: node mongo.js <password>')
  process.exit(1)
}*/

//const password = process.argv[2]

const url = process.env.MONGODB_URI

mongoose.connect(url)
  .then(() => console.log('connected to MongoDB'))
  .catch(error => console.log('error', error.message))

const personSchema = new mongoose.Schema({
  name: String,
  number: String
})
const Person = mongoose.model('Person', personSchema)

//node mongo.js password newName newNumber
if(process.argv.length === 4) {
  console.log('Person entry')
  const person = new Person({
    name: process.argv[2],
    number: process.argv[3]
  })
  person.save().then(() => {
    console.log(`person saved: ${person.name} ${person.number}`)
    mongoose.connection.close()
  })
//node mongo.js password
} else if(process.argv.length === 2) {
  console.log('no args')
  Person.find({}).then(result => {
    result.forEach(person => {
      console.log(person)
    })
    mongoose.connection.close()
  })
}