export default function BCAHomePage() {
  return (
    <>
      <h1 className="text-2xl font-bold text-label">Protected Page</h1>
      <p className="text-base text-dark">Shouldn't show unless logged in</p>
    </>
  );
}
