const mongoose = require('mongoose')

if (process.argv.length < 3) {
  console.log('Please provide the password as an argument: node mongo.js <password>')
  process.exit(1)
}

if (process.argv.length == 4 || process.argv.length >= 6) {
    console.log('Please provide the correct number of arguments')
    process.exit(1)
}

const password = process.argv[2]

const url =
  `mongodb+srv://fullstack:${password}@cluster0.ubwye.mongodb.net/phonebookApp?retryWrites=true&w=majority`

mongoose.connect(url)

  const personSchema = new mongoose.Schema({
    name: String,
    number: String
  })
  
const Person = mongoose.model('Person', personSchema)
  

if (process.argv.length == 5) {
    const name = process.argv[3]
    const phone = process.argv[4]
    const person = new Person({
        name: name,
        number: phone
    })
    person.save().then(result => {
        console.log(`added ${name} ${phone} to phonebook`)
        mongoose.connection.close()
    })
} else {
    Person.find({}).then(result => {
        console.log('phonebook:')
        result.forEach(person => {
          console.log(`${person.name} ${person.number}`)
        })
        mongoose.connection.close()
      })
}


