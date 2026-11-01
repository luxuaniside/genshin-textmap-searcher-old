function Header() {
  return (
    <header className="app-header">
      <img className="header-mascot" src="/mascot.png" alt="" width="64" height="64" />
      <div>
        <h1>
          Luxuani's <span>Textmap</span> Searcher
        </h1>
        <p className="page-subtitle">Search for appearences of any specific text entries.</p>
      </div>
    </header>
  );
}

export default Header;
