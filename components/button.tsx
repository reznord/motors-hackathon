export default function Button(props) {
  return (
    <a
      className={`text-white border-0 py-4 px-8 focus:outline-none rounded text-lg focus:ring-2 focus:ring-black bg-blue-700 hover:bg-blue-800`}
      {...props}
    />
  );
}
