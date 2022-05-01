console.clear()

const mongoose = require('mongoose')

console.log('argv:', process.argv.length)

if (process.argv.length < 3) {
  console.log('Please provide the password as an argument: node mongo.js <password>')
  process.exit(1)
}

const password = process.argv[2]

const url =
  `mongodb+srv://phonebook:${password}@cluster0.pwxhu.mongodb.net/numberApp?retryWrites=true&w=majority`
mongoose.connect(url)
  .then(result => console.log('connected to MongoDB'))
  .catch(error => console.log('error', error.message))

const personSchema = new mongoose.Schema({
  name: String,
  number: String
})
const Person = mongoose.model('Person', personSchema)

//node mongo.js password newName newNumber
if(process.argv.length === 5) {  
  console.log('Person entry')
  const person = new Person({
    name: process.argv[3],
    number: process.argv[4]
  })
  person.save().then(result => {
    console.log(`person saved: ${person.name} ${person.number}`)
    mongoose.connection.close()
  })
//node mongo.js password  
} else if(process.argv.length === 3) {
  console.log('password only')
  Person.find({}).then(result => {
    result.forEach(person => {
      console.log(person)
    })
    mongoose.connection.close()
  })
}

