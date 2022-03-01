## CCOE-Website Micro-Site
**CCOE-Website, created with the Micro-Site Builder**

Below are some steps to run your new Docusaurus site locally. [Click here to read more documentation](https://microsite-docs.optum.com), but main actions to take from here would be:
1. Update content, which can be done through GitHub
2. Redeploy your site, which [can be done in many ways](https://microsite-docs.optum.com/getting-started/deploy)

### Requirements
Before getting started, make sure you have the following installed:
- [Node.js](https://nodejs.org) v12 or later
- [git](https://git-scm.com) v2.14.1 or later
- [Yarn](https://yarnpkg.com) is optional, npm can still be used (installed with Node.js)

To start working on your documentation locally, you will need to clone this repo:

```bash
git clone https://github.optum.com/oaccoe/CCOE-Website.git
cd CCOE-Website
```

### Installation
```bash
yarn
```

or with npm,

```bash
npm i
```

### Local Development
```bash
yarn start
```
or with npm,
```bash
npm run start
```

This command starts a local development server and open up a browser window. Most changes are reflected live without having to restart the server.

### Build
```bash
yarn build
```
or with npm,
```bash
npm run build
```

This command generates static content into the `build` directory and can be served using any static contents hosting service.

### Deployment
```bash
GIT_USER=knaidu2 yarn deploy
```
or with npm,
```bash
GIT_USER=knaidu2 npm run deploy
```

This command is a convenient way to build your website and push to the `gh-pages` branch to be hosted on GitHub Pages. Make sure to keep the following configuration options in [`docusaurus.config.js`](docusaurus.config.js) up to date if anything changes:

```javascript
module.exports = {
  url: 'https://github.optum.com/pages/oaccoe/CCOE-Website',
  baseUrl: '/pages/oaccoe/CCOE-Website/',
  organizationName: 'oaccoe',
  projectName: 'CCOE-Website',
  githubHost: 'github.optum.com',
  ...
}
```

### Collaboration
To continue driving better documentation for your customers, other contributers will be able to improve or build upon your page through this repository. Read more about pull requests and other ways to collaborate [right here](https://microsite-docs.optum.com/getting-started/collaborate)!

### Reference
Refer to [this site](https://microsite-docs.optum.com) for more documentation about Micro-Sites.