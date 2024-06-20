# transformaciones-web

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 9.1.15.

## Get started

### Prerequisites

1. Install [Node.js](https://nodejs.org) version 12.18.3 and [npm](https://www.npmjs.com) version 6.14.6.

### Clone the repo

```shell
git clone https://gitlab.grainchain.io/silosys/transformaciones-web
cd transformaciones-web
```

### Install npm packages

Install the `npm` packages described in the `package.json`:

```shell
npm install
```

## Settings

Before running this project, configure the environment files located in src/environments, with the variables required for its proper operation.

## Development server

Run `npm start` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## Code scaffolding

Run `npm run ng generate component component-name` to generate a new component. You can also use `npm run ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `npm run ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `--prod` flag for a production build.

## Running unit tests

Run `npm run ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `npm run ng e2e` to execute the end-to-end tests via [Protractor](http://www.protractortest.org/).

## Further help

To get more help on the Angular CLI use `npm run ng help` or go check out the [Angular CLI README](https://github.com/angular/angular-cli/blob/master/README.md).


## CONVENTIONS
 
Description for project conventions.
 
### Permissions
 
- Directive: Apply this directive in a component or HTML Element to hide/show it depending on user permissions.
It receives an object with two keys, the first one is a constant string that indicates each module tag name. The second one is a constant string for each permission action type (create, read, update, delete and print).
 
Example: `*permission: {tag: 'farms', type: 'read'}`
 
NOTES: Tag name and permission type values are located in the constants file (src\app\shared\utils\constants\constants.ts).
 
An element can only have ONE directive. Use <ng-container> as a wrapper to avoid this issue.
 
User permissions object is saved in local storage as “token-data”, right after log in.



