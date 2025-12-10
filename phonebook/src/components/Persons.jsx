const Persons = ({ persons, filter, handleDelete }) => {
  const filteredPersons = persons.filter((person) =>
    person.name.toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <div>
      {filteredPersons.map((person) => (
        <div key={person.name}>
          {person.name} {person.number}
          <button onClick={() => handleDelete(person.id, person.name)}>
            Delete
          </button>
        </div>
      ))}
    </div>
  );
};

export default Persons;