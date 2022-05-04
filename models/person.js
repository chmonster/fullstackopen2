//console.clear()

const mongoose = require('mongoose')

const url = process.env.MONGODB_URI
console.log('connecting to', url)

mongoose.connect(url)
  .then(() => console.log('connected to MongoDB'))
  .catch(error => console.log('error', error.message))

const personSchema = new mongoose.Schema({
  name: {
    type: String,
    minLength: [3, 'Name too short'],
    required: [true, 'Name required']
    //unique: true
  },
  number: {
    type: String,
    //minLength: 8,
    validate: {
      validator: function(v) {
        return /^\d{2}(-|\d)\d{5,}$|^\d{3}(-|\d)\d{4,}$/.test(v)
      },
      message: props => `${props.value} is not a valid phone number`
    },
    required: [true, 'Phone number required']
  }
})

personSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

module.exports = mongoose.model('Person', personSchema)