# D3 Show and Tell

## Overview
This is an application I built as a presentation for a Pandera Labs show and tell. It provides an overview of D3 & SVG.

The presentation is actually built entirely with SVG and allows you to make changes by updating the code in the editor on the left. The changes will be reflected when you press the "Save" button above the editor.

You can see the example application running at http://d3-show-and-tell.surge.sh.

## Technologies Used
- create-react-app (Ejected)
- Babel (using babylon and babel-standalone)
- Bloomer/Bulma
- D3
- Emotion
- Lodash
- Monaco (Visual Studio Code editor library)
- React
- React Router
- Redux
- TypeScript
- TSLint
- Webpack

## Purpose
D3 Show and Tell's purpose is to provide a brief overview of SVG and D3 while allowing the viewer to change the SVG code used to render the slides. Rather than just reading about D3/SVG, you can mess around with it while learning.

## Interface Overview
### Header/Navigation Drawer
You can click the hamburger menu to access the navigation drawer. This allows you to navigate to any slide by clicking on the title.

### Code Editor Header
The header above the code editor in the left column contains tabs that are used to navigate between the corresponding content as well as **Save** and **Reset** buttons.

Here's an overview of each content type:
- **Code**: JavaScript code where the React components and SVG resides
- **Styles**: CSS associated with React components
- **Data**: Any data associated with the slide in JSON format (used primarily for D3 charts)
- **Paths**: SVG path elements in the form of React components

Changing the values for any of the content will update the slide display when you press the **Save** button in the header.
If you wish to revert the code to what was originally shown, press the **Reset** button.

### Code Editor
The code editor uses Monaco, the editor used in Visual Studio Code. Most of the out-of-the-box shortcut keys should work.
You can acess the Command Palette by pressing `F1` and use the right-click context menu as well.

### Code Editor Vertical Navigation Bar
The up and down arrow buttons at the bottom-left of the code editor will move to the previous or next line with an `@bookmark` comment. You can add your own `@bookmark` tag by including it in a code comment.

### Slide Display
The content rendered from the code editor is displayed in the column on the right.

The header above the slide allows you to move to the previous and next slides using the corresponding arrow buttons.

When a slide first loads, you click on it to display the next bullet point.

## Prerequisites
- Node.js >= 8.11

## Building and Running
- Install the required dependencies:
```
yarn install
```
- Run the application on port `3000`:
```
yarn start
```
- Build the application:
```
yarn build
```
