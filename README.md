# R-B-Workspace

**Storybaord Link:**
https://www.figma.com/design/HHZdmDne6xKOU7ByGOceui/R-and-B-Draft-1-design?node-id=0-1&t=2oEARqJDMFis0EXt-1

**UML Design**: https://drive.google.com/file/d/1EPChNcvHQsLU-triosukWGCwV4YevZjO/view?usp=sharing

**Tech Spec**: https://docs.google.com/document/d/1KV_gmDjXDH_APVD4Cr4z7WUGW1sjlT35H7f8GYYq-uQ/edit?tab=t.0#heading=h.9b0i6jpuww9w

We are using _Prettier_ for formatting.
If using VS Code, go to extensions and type _Prettier_, click install.

If using something else, you can format with Prettier from the command line.

Type `npm install --save-dev --save-exact prettier` to install.

Type `npx prettier . --write` to run.

When editing a file enter ctrl + S to format code.

`prettier --write`. is great for formatting everything, but for a big project it might take a little while. You may run `prettier --write app/` to format a certain directory, or `prettier --write app/components/Button.js` to format a certain file. Or use a glob like `prettier --write "app/**/*.test.js"` to format all tests in a directory.

For more information about using Prettier go to https://prettier.io/docs/install

# How to Collaborate
**Installing Packages**
Run npm install in the root directory
This will install @google/genai, Express, CORS, Mongoose, and set up the React dependencies. 

Create a new branch with your changes.

Create a pull request.

Then we'll merge. 
