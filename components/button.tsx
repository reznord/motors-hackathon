export default function Button({
  children,
  Icon = null,
  RightIcon = null,
  ...props
}) {
  return (
    <a
      className="text-center text-white border-0 py-2 px-4 focus:outline-none rounded text-lg focus:ring-2 focus:ring-black bg-blue-500 hover:bg-blue-600"
      {...props}
    >
      <span className="flex gap-2 items-center">
        {Icon ? <Icon className="h-8 w-8" /> : null}
        {children}
        {RightIcon ? <RightIcon className="h-8 w-8" /> : null}
      </span>
    </a>
  );
}
