import { useState, useEffect } from "react";
import personService from "./services/persons.js";

import Filter from "./components/Filter.jsx";
import PersonForm from "./components/PersonForm.jsx";
import Persons from "./components/Persons.jsx";
import Notification from "./components/Notification.jsx";

const App = () => {
  const [persons, setPersons] = useState([
    { name: "Arto Hellas", number: "713-519-2015" },
  ]);
  const [newName, setNewName] = useState("");
  const [newNumber, setNewNumber] = useState("");
  const [filter, setFilter] = useState("");
  const [message, setMessage] = useState({ content: "", messageType: "" });

  // Load initial data
  useEffect(() => {
    personService.getAll().then((initialPersons) => {
      setPersons(initialPersons);
    });
  }, []);

  // Add a person to the database
  const addPerson = (event) => {
    event.preventDefault();
    if (!newName || !newNumber) return alert("Enter a valid name and number");

    const nameExists = persons.some(
      (p) => p.name.toLowerCase() === newName.toLowerCase()
    );
    if (nameExists) return alert(`${newName} is already added to phonebook`);

    const newPerson = { name: newName, number: newNumber };

    personService
      .create(newPerson)
      .then((returnedPerson) => {
        setPersons(persons.concat(returnedPerson));
      })
      .then(() => {
        setMessage({
          content: `Added ${newPerson.name}`,
          messageType: "addedPersonSuccess",
        });
        setTimeout(() => {
          setMessage({ content: "", messageType: "" });
        }, 5000);
      });
    setNewName("");
    setNewNumber("");
  };

  // Removing a person from the database
  const handleDelete = (id, name) => {
    // Confirmation Pop-up
    if (!window.confirm(`Delete ${name}?`)) return;

    personService
      .remove(id)
      .then(() => {
        setPersons(persons.filter((p) => p.id !== id));
      })
      .catch(() => {
        alert(`The person ${name} was already removed from the server`);
        setPersons(persons.filter((p) => p.id !== id)); // Remove stale client copy
      });
  };

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification
        message={message.content}
        messageType={message.messageType}
      />
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
      <Persons persons={persons} filter={filter} handleDelete={handleDelete} />
    </div>
  );
};

export default App;
