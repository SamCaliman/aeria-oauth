# Quickstart

This is an Aeria project bootstrapped with [`create-aeria-app`]().
It uses the `npm` package manager, which you may change in the future. You may also replace this README.md file with your own at anytime.

To get documentation, visit [https://aeria.land/](https://aeria.land/).

## Installation

```sh
$ npm install
```

## Running

```sh
$ npm run dev
```

You may sign in into your application visiting `http://localhost:8080/user/signin`.

## for the Env files

### api
```
GITHUB_CLIENT_ID = your_client_id
GITHUB_CLIENT_SECRET = your_client_secret

TWITCH_CLIENT_ID = your_client_id
TWITCH_CLIENT_SECRET = your_client_secret

GOOGLE_CLIENT_ID = your_client_id
GOOGLE_CLIENT_SECRET = your_client_secret

```

### web
```
VITE_GITHUB_CLIENT_ID = your_client_id

VITE_TWITCH_CLIENT_ID = your_client_id

VITE_GOOGLE_CLIENT_ID = your_client_id

```

## Observation
```
Since the localhost is running http instead of https, i had to make separate redirect views.
If you are going to deploy, consider using document.refereer and checking what service the user used and merging the views in one. 
```

## Support

- [Official website](https://aeria.land/)
- [Discord community]() (get live support almost 24/7)

