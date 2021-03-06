<div align="center">
  <img src="/docs/img/colonyStarter_color.svg" width="600" />
</div>
<div align="center">
  <a href="https://circleci.com/gh/JoinColony/colonyStarter">
    <img src="https://circleci.com/gh/JoinColony/colonyStarter.svg?style=shield" />
  </a>
  <a href="https://gitter.im/JoinColony/colonyStarter">
    <img src="https://img.shields.io/gitter/room/TechnologyAdvice/Stardust.svg" />
  </a>
  <a href="https://build.colony.io/">
    <img src="https://img.shields.io/discourse/https/build.colony.io/status.svg" />
  </a>
</div>

# Colony Starter

_Learn to build with Colony! Get a head start on your next project!_ Colony Starter (formerly known as "Hackathon Starter") includes a variety of starter projects that demonstrate how to use and integrate different tools with Colony.

## Get Started

### Prerequisites

- Yarn
- Docker
- Node 9.10

_You may find it helpful to use Node Version Manager (`nvm`) to manage Node versions._

_If you are using Linux, check out the [Linux Setup](/.github/LINUX_SETUP.md) page to ensure Yarn and Docker are set up accordingly._

### Step 1

Globally install the [colony-starter](/packages/colony-starter) package:

```
yarn global add @colony/colony-starter
```

### Step 2

Move to your working directory and unpack the [colony-starter-basic](/packages/colony-starter-basic) package:

```
colony-starter colony-starter-basic
```

Alternatively, you can use [npx](https://www.npmjs.com/package/npx) and kickstart the [colony-starter-basic](/packages/colony-starter-basic) package in one line without having to globally install the [colony-starter](/packages/colony-starter) package:

```
npx -p @colony/colony-starter colony-starter colony-starter-basic
```

### Step 3

Move to your new project directory and checkout the [colony-starter-basic](/packages/colony-starter-basic) readme:

```
cd colony-starter-basic
```

## Starter Projects

Now that you have a basic understanding of how Colony works, check out some of the other starter projects by repeating steps 2 and 3 and substituting `colony-starter-basic` with the project of your choice!

- [colony-starter-basic](/packages/colony-starter-basic)
- [colony-starter-react](/packages/colony-starter-react) (_coming soon..._)

## Contribute

_Are you interested in contributing?_ Check out the following documents for more information:

- [Contributing](/.github/CONTRIBUTING.md)
- [Development](/.github/DEVELOPMENT.md)
