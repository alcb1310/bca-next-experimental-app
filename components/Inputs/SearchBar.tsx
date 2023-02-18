/* eslint-disable @typescript-eslint/no-explicit-any */
export default function SearchBar({
  onChange,
  value,
}: {
  onChange: any;
  value: string;
}) {
  return (
    <>
      <input
        type="search"
        id="search"
        className="block p-2.5 w-full z-20 text-sm text-gray-900 bg-gray-50 rounded-lg  border-2 border-gray-300 focus:ring-indigo-500 focus:border-indigo-500 "
        placeholder="Search"
        onChange={onChange}
        value={value}
        required
      />
      <button
        type="submit"
        className="absolute top-0 right-0 p-2.5 text-sm font-medium text-white bg-indigo-700 rounded-r-lg border border-indigo-700 hover:bg-indigo-800 focus:ring-4 focus:outline-none focus:ring-indigo-300 "
      >
        <svg
          aria-hidden="true"
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
        <span className="sr-only">Search</span>
      </button>
    </>
  );
}
