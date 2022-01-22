export default function Nav() {
  return (
    <header class="d-flex justify-content-center py-3">
      <nav class="navbar navbar-expand-md fixed-top navbar-dark bg-dark">
        <div class="container">
          <a class="navbar-brand" href="/">Wordle Results History</a>
          <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
            <span class="navbar-toggler-icon"></span>
          </button>
          <div class="collapse navbar-collapse" id="navbarNav">
            <ul class="navbar-nav">
              <li class="nav-item">
                <a class="nav-link active" aria-current="page" href="/">Home</a>
              </li>
              <li class="nav-item">
                <a class="nav-link" href="/about">About</a>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </header>
  );
}
