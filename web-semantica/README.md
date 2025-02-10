# My React RDF Node Viewer

This project is a simple React application that displays a single page with arrows pointing in four directions (up, down, left, right) and loads the content of an RDF node. It also displays the relationships (predicates) of the node on each side.

## Project Structure

```
my-react-app
├── public
│   ├── index.html
│   └── favicon.ico
├── src
│   ├── components
│   │   ├── Arrow.js
│   │   └── RDFNode.js
│   ├── App.js
│   ├── index.js
│   └── styles.css
├── package.json
└── README.md
```

## Installation

1. Clone the repository:
   ```
   git clone <repository-url>
   ```
2. Navigate to the project directory:
   ```
   cd my-react-app
   ```
3. Install the dependencies:
   ```
   npm install
   ```

## Usage

To start the application, run:
```
npm start
```
This will launch the application in your default web browser.

## Components

- **App.js**: The main component that renders the layout with arrows and loads the RDF node content.
- **Arrow.js**: A functional component that displays an arrow in the specified direction.
- **RDFNode.js**: A functional component that fetches and displays the content of an RDF node and its relationships.

## Styles

The styles for the application are defined in `styles.css`, which includes styles for the arrows and layout.

## License

This project is licensed under the MIT License.