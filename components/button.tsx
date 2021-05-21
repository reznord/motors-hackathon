export default function Button({ className = "", ...props }) {
  return (
    <a
      className={`text-white bg-blue-700 border-0 py-2 px-8 focus:outline-none hover:bg-blue-800 rounded text-lg focus:ring-2 focus:ring-black ${className}`}
      {...props}
    />
  );
}
