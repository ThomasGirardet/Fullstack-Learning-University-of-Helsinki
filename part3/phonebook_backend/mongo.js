mongoose = require("mongoose");

//Input Validation
const validateArguments = () => {
  const argCount = process.argv.length;

  if (argCount < 3) {
    console.log("Give a password as an argument");
    process.exit(1);
  }

  if (argCount == 4) {
    console.log("Give both a name and a phone number when adding a person");
    process.exit(1);
  }

  if (argCount > 5) {
    console.log("Too many arguments");
    process.exit(1);
  }
};
const connectToDatabase = (password) => {
  const url = `mongodb+srv://fullstack:${password}@cluster0.i9xhpol.mongodb.net/?appName=Cluster0`;

  mongoose.set("strictQuery", false);
  return mongoose.connect(url, { family: 4 });
};

const personSchema = new mongoose.Schema({
  id: String,
  name: {
    type: String,
    minLength: 3,
    required: true,
  },
  number: {
    type: String,
    required: true,
  },
});

const Person = new mongoose.model("Person", personSchema);

const listAllPersons = () => {
  Person.find({})
    .then((result) => {
      console.log("Phonebook:");
      result.forEach((person) => {
        console.log(`${person.name} ${person.number}`);
      });
      mongoose.connection.close();
    })
    .catch(() => {
      console.error("Error fetching persons");
      mongoose.connection.close();
    });
};

const generateId = () => {
  return Person.find({}).then((result) => {
    const maxId =
      result.length > 0
        ? Math.max(...result.map((person) => Number(person.id)))
        : 0;

    return String(maxId + 1);
  });
};

const addPerson = (newName, newNumber) => {
  generateId()
    .then((newId) => {
      const newPerson = new Person({
        id: newId,
        name: newName,
        number: newNumber,
      });

      return newPerson.save();
    })
    .then((result) => {
      console.log(`Added ${newName} number ${newNumber} to phonebook`);
      mongoose.connection.close();
    })
    .catch(() => {
      console.error("Error adding person");
      mongoose.connection.close();
    });
};

// Main execution
validateArguments();
const password = process.argv[2];
const addingPerson = process.argv.length === 5;

connectToDatabase(password);

if (addingPerson) {
  const name = process.argv[3];
  const number = process.argv[4];

  addPerson(name, number);
} else {
  listAllPersons();
}
