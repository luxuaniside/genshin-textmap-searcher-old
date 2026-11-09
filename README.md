# Luxuani Textmap Searcher

A web app for searching English and Chinese Genshin Impact text, including dialogue and other in-game text entries.

> **Live demo:** https://luxuani-textmap-searcher.onrender.com

## Features

- Search more than 700,000 text entries.
- Search in English and Chinese.
- Search for one phrase or multiple phrases at once.
- Filter results by game version and browse paginated results.
- Highlight matching terms in English results.

## Development

Requirements: Node.js and npm.

```sh
npm install
npm run dev
```

Vite prints the local development URL after the server starts.

The app uses `http://127.0.0.1:8000` as its default API URL. To use a different API, set `VITE_API_URL` in a local `.env` file. `VITE_SEARCH_PATH` can optionally override the search route; it defaults to `/search`.

## Scripts

```sh
npm run dev      # Start the development server
npm run build    # Create a production build
npm run preview  # Preview the production build
npm run lint     # Lint the frontend
```

## Screenshot

<img width="1029" height="757" alt="Textmap Searcher" src="https://github.com/user-attachments/assets/1c984eb9-d136-4d56-ae46-ed061078768d" />

## Tech Stack

- React
- Vite
- Tailwind CSS

## Disclaimer

This is an unofficial fan-made project. Genshin Impact and its associated game text and assets belong to HoYoverse and their respective rights holders.

Text data is sourced from [AnimeGameData](https://gitlab.com/Dimbreath/animegamedata2).

## License

This project is licensed under the MIT License.
