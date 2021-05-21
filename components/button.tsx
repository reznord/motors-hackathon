export default function Button(props) {
  return (
    <a
      className="text-white bg-blue-500 border-0 py-2 px-8 focus:outline-none hover:bg-blue-600 rounded text-lg cursor-pointer"
      {...props}
    />
  );
}
