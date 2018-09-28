import React from "react"
import cat from "./cat.svg"

export default () => (
  <main className="Home">
    <header>
      <img src={cat} className="Home-logo" alt="logo" width="200" />
      <h1>The Cat API</h1>
    </header>
    <section>
      <h3>Get A Cat</h3>
      <code>
        <a
          target="_blank"
          rel="noopener noreferrer"
          href="https://cat.reactjsgirls.com/cat"
        >
          https://cat.reactjsgirls.com/cat
        </a>
      </code>
    </section>
    <section>
      <h3>Get 10 Cats</h3>
      <code>
        <a
          target="_blank"
          rel="noopener noreferrer"
          href="https://cat.reactjsgirls.com/cats/10"
        >
          https://cat.reactjsgirls.com/cats/10
        </a>
      </code>
    </section>
    <h4>
      Kittens for all your needs{" "}
      <span role="img" aria-label="cat">
        😸
      </span>
    </h4>

    <footer>
      <a
        target="_blank"
        rel="noopener noreferrer"
        href="https://github.com/ReactJSGirls/cat-api"
      >
        Github
      </a>{" "}
      <a
        target="_blank"
        rel="noopener noreferrer"
        href="https://twitter.com/NikkitaFTW"
      >
        Made by Sara Vieira
      </a>
    </footer>
  </main>
)
