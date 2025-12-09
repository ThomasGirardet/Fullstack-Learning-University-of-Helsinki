import Part from "./Part.jsx";

const Content = ({ parts }) => {
  const total = parts.reduce((sum, part) => sum + part.exercises, 0);
  return (
    <div>
      {parts.map((part) => (
        <Part key={part.id} name={part.name} exercises={part.exercises} />
      ))}

      <p>Total of {total} exercises</p>
    </div>
  );
};

export default Content;
