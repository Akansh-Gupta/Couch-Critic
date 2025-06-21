export default function Loading() {
  return (
    <div className="movie-section">
      <div className="loading">
        <img
          src={`${process.env.PUBLIC_URL}/images/logo/loading.gif`}
          alt="Loading..."
        />
        <br />
        Loading...
      </div>
    </div>
  );
}