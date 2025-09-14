# Startup Instructions

To get the project running locally:

1. **Install dependencies**

   ```bash
   npm install
   ```

2. **Run an entry point**

   The repository does not yet define a default start script. After adding an entry file that imports the game engine you can launch it with Node, for example:

   ```bash
   node your-entry-file.js
   ```

   If you add a `start` script to `package.json`, you can run the project with:

   ```bash
   npm start
   ```

3. **Test**

   The project currently has no test suite. Running `npm test` will report that no tests are defined.

