export default function TestHome() {
  const newVariable = 'This is a new variable'

  console.warn(newVariable)

  return (
    <div className="m-4 bg-light p-4 text-dark">
      <h1 className="text-3xl font-bold uppercase">Testing</h1>
      <p className="text-gray-800">Testing saving in nvim with Ctrl+c</p>
      <p className="text-gray-800">Another saving test without pressing Esc</p>
      <p className="text-gray-800">Final test</p>
      <p>Some text</p>
    </div>
  )
}
