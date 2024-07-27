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
- github
```
GITHUB_CLIENT_ID = your_client_id
GITHUB_CLIENT_SECRET = your_client_secret

GITHUB_TOKEN_URL=https://github.com/login/oauth/access_token
GITHUB_USER_URL=https://api.github.com/user
GITHUB_REDIRECT_URI=http://localhost:8080/redirectGit
```
- twitch
```
TWITCH_CLIENT_ID = your_client_id
TWITCH_CLIENT_SECRET = your_client_secret

TWITCH_TOKEN_URL= https://id.twitch.tv/oauth2/token
TWITCH_USER_URL=https://api.twitch.tv/helix/users
TWITCH_REDIRECT_URI=http://localhost:8080/redirectTwitch
```
- google
```
GOOGLE_CLIENT_ID = your_client_id
GOOGLE_CLIENT_SECRET = your_client_secret

GOOGLE_TOKEN_URL=https://accounts.google.com/o/oauth2/token
GOOGLE_USER_URL=https://www.googleapis.com/oauth2/v3/userinfo
GOOGLE_REDIRECT_URI=http://localhost:8080/redirectGoogle
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

