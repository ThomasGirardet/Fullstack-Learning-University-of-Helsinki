import { useState } from "react";

// 1️⃣ Filter component
const Filter = ({ filter, handleFilterChange }) => (
  <div>
    filter shown with: <input value={filter} onChange={handleFilterChange} />
  </div>
);

// 2️⃣ PersonForm component
const PersonForm = ({
  addPerson,
  newName,
  handleNameChange,
  newNumber,
  handleNumberChange,
}) => (
  <form onSubmit={addPerson}>
    <div>
      name: <input value={newName} onChange={handleNameChange} />
    </div>
    <div>
      number: <input value={newNumber} onChange={handleNumberChange} />
    </div>
    <div>
      <button type="submit">add</button>
    </div>
  </form>
);

// 3️⃣ Persons component
const Persons = ({ persons, filter }) => {
  const filteredPersons = persons.filter((person) =>
    person.name.toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <div>
      {filteredPersons.map((person) => (
        <div key={person.name}>
          {person.name} {person.number}
        </div>
      ))}
    </div>
  );
};

// App component (root)
const App = () => {
  const [persons, setPersons] = useState([
    { name: "Arto Hellas", number: "713-519-2015" },
  ]);
  const [newName, setNewName] = useState("");
  const [newNumber, setNewNumber] = useState("");
  const [filter, setFilter] = useState("");

  // Add person handler
  const addPerson = (event) => {
    event.preventDefault();
    if (!newName || !newNumber) return alert("Enter a valid name and number");

    const nameExists = persons.some(
      (p) => p.name.toLowerCase() === newName.toLowerCase()
    );
    if (nameExists) return alert(`${newName} is already added to phonebook`);

    const newPerson = { name: newName, number: newNumber };
    setPersons(persons.concat(newPerson));
    setNewName("");
    setNewNumber("");
  };

  return (
    <div>
      <h2>Phonebook</h2>
      <Filter
        filter={filter}
        handleFilterChange={(e) => setFilter(e.target.value)}
      />

      <h3>Add a new</h3>
      <PersonForm
        addPerson={addPerson}
        newName={newName}
        handleNameChange={(e) => setNewName(e.target.value)}
        newNumber={newNumber}
        handleNumberChange={(e) => setNewNumber(e.target.value)}
      />

      <h3>Numbers</h3>
      <Persons persons={persons} filter={filter} />
    </div>
  );
};

export default App;
