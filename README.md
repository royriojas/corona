# Corona charts
A super simple web page to compare the covid-19 progress on several countries

## Requirements
- node v12 (TODO: Include a docker compose file)

## Development
- Clone the repo
- cd to repo folder
- run `npm i`
- run `npm run start:dev`
- navigate to localhost:8083
- enjoy

## Deployment to netlify
- Use the `public/` folder to deploy this as a static site

## Update the data
- run `npm run update:data` and rebuild the app. It will fetch the newer data from https://pomber.github.io/covid19
