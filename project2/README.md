# Project 2 - JS Chat

* Due by **Wed Jul 16, 11:59pm **

## Submission Instructions

* start from the up-to-date main branch (`git checkout main; git pull origin main`)
* Create a feature branch named 'project2' (`git checkout -b project2`)
* Create the files in this directory to have the require features
* Add, commit, and push the branch to github
* Create a PR to merge to main
* Be sure to include the TA(s) and I as reviewers.  

## Goals and Expectations

You will be writing a SPA using JS as shown in class that calls REST services (that you also write).  This SPA will be a simple Chat application.  This chat application is a single chat forum, like #questions in our class Slack - all users see the same list of messages, including messages posted before they logged in.

Your app will be tested for grading by running:
- `npm install`
- `npm run build`
- `npm start`
    - This must start your single express-based server, not `web-dev-server` or other options
- Visiting `http://localhost:3000/` in the browser
- You may include other commands/scripts for development if you wish
  - Note: You may use `node --watch` or `npx webpack --watch` for development, but those should not be the `start` and `build` scripts

### Learning Goals of this assignment:
- Write RESTful services using express, following the 3 Basic Rules of Rest presented in class.  
    - Reminder that these are my personal rules summarizing REST, you won't be able to Google them effectively
- Call RESTful services in front end JS using fetch as demonstrated in class
- Practice maintaining persistent state on the server and using services to load and update client state
- Practice using browser based JS to maintain and update state, and use that state to render updates to the HTML
- Practice using RESTful services for authentication/authorization
- Write a basic polling feature to check the server for updates and update client state
  - Not using websockets or long polling, just a simple time-based loop

### Expectation Overview

- Write an express server that will serve static assets and RESTful services
- Load a static HTML page as the SPA from your express server
  - This means there should be only one single html page!
- The HTML will load a static JS file bundled and transpiled with webpack and babel
- The SPA will require a user to login to view the chat or send messages
  - The SPA will determine (using a service call) on load if the user is already logged in. Users that are already logged in are not required to login again.
- A logged in user will see a list of messages, a list of currently logged in users, and will be able to send messages
    - You decide whether messages and users are part of the same service call or different service calls
- Every displayed message will identify which user sent it
- Every 5 seconds (roughly) the client side will check to see if there are new messages and/or if the list of currently logged in users has changed
  - Do NOT rewrite the HTML for the input form when you get polling results (a user typing a message will be interrupted and the message-in-progress will be lost!)
    - Hint: have a smaller render function that covers the users and the messages, but doesn't rewrite the form that gathers the input
- A user can logout and return to the login screen
  - This removes that session from the list of currently logged in users
  - A given user might be logged in more than once at the same time (using multiple browsers or different browser profiles here, more often on phone/desktop in reality)!  Make sure the username only shows up once in the list of users regardless of how many simultaneous sessions they have, and that the username only leaves the list of currently logged in user when all sessions are logged out of
  - Because we are only counting explicit "logout" actions, this app will consider a user that left the app (closing the tab or navigating to another page) as still "logged in" - that is fine for this assignment
- Multiple users can be logged in at once (use different browsers or different browser profiles to do this yourself) and can send and see messages from one another

### Visual Expectations

You are welcome to use/adapt your HTML/CSS from the `basic-express` assignment, subject to the requirements below and feedback on that assignment

You have wide discretion on the appearance of the chat, but:
- You must have SOME styling provided by CSS
- There must be no horizontal scrolling at normal desktop screen sizes (>800px width) and with usernames of up to 20 characters and normal sized words used in chat
- You may have min- or max-widths for the chat area, but it must not be set to the same fixed width for all users regardless of their window
- The list of users should be visually distinct from the list of messages
- There should be good whitespace, colors, and legibility throughout to promote usability
- The app should strive for usability 
  - Example: It should be convenient to send new messages, the polling should not "interrupt" a message that is in the middle of being typed
- You must have a loading indicator (text, image, and/or CSS) for:
  - When the page is loading and the SPA does not yet know if the user is "logged in" or not
  - When the user logs in and the initial list of users/list of messages are being loaded
- You may have loading indicators for other situations or not, your choice
- Service calls that generated unexpected errors should inform the user
  - Example: GET /session can return 401 if the user is not logged in.  This is expected, and will impact what is shown (login form or chat) but will not trigger a specific message to the user.  However, a 400 response when trying to login is NOT the expected response, and will trigger a message displayed on-screen in the app to the user)
  - Hint: It is MUCH TOO COMMON that students lose points for failing to report errors to the user. Examples from class have not done this for you, so you can't simply copy code examples, you must demonstrate understanding of what to do to give error messages to the user and do so.
- SPECIAL: There is no requirement about keeping any vertical scroll position when new messages come in, but I encourage you to think about how you could manage that. 

### Security Expectations

- There should not be any password involved at all
- User "dog" will be rejected with a 403 error on login (we use this check instead of checking for password)
  - The 403 is the status code of the service call.  The 403 number does not get shown to the user.
- Services that require authorization should respond with the appropriate Status Codes (401) if the request does not have a valid sid cookie value
- You should allowlist to sanitize the username
  - Hint: This MUST be done on the server-side.  Client-side can prevent "bad" usernames or must handle if the server returns an error, but even if your front-end code will not allow a user to send an invalid username the server must check for and prevent an invalid username.
- An empty message will trigger a 400 status code
- There is no requirement to sanitize messages beyond checking for an empty message, BUT you should think about what would be required to prevent injection attacks and how you would do so.
- All service calls that return lists of users or lists of messages require authorization
- All service calls to send messages require authorization
- The services must never trust the user input to decide which user is sending a message (That is, the username will not be input for service calls to send messages - instead, use the sid to find what username that session belongs to and use that).  This is different than with the basic-express assignment (we had not done login at that time)

### Quality Expectations
- You must follow the best practices outlined in the course so far for JS, CSS, HTML, services, and file structures
- The services must follow the REST requirements outlined in class
- The service urls must be in an `/api/` path
- The service urls must have a version in their path
- There is no requirement to paginate the service results on this assignment
- Use Semantic HTML as much as you can
- Use Semantic CSS/HTML class names using kebab-case
  - Semantic BEM-style names are permitted
- Follow any suggestions previously given to you in code reviews

### Additional Restrictions
- All services will return JSON (if they return a body) and receive JSON (if they receive a body)
- Do NOT use localStorage, sessionStorage, IndexedDB, cookies, or other forms of client-side storage, except a cookie to hold a `sid` value
- Do NOT interact with the browser url, including hash fragment
- Do NOT include files in your PR that are outside the assignment (no IDE configs, `node_modules/`, etc)
* Do not use external JS other than express, cookie-parser, and the modules we've used for webpack and babel
  - express-session is NOT allowed!
  - The uuid module is NOT allowed, you should use uuid values obtained using the methods from class
  - Modules that do not require npm install are allowed, but make sure you aren't venturing outside the project goals
* Do not use any other outside JS or CSS files or other assets
  - Exception: You may use Google fonts
  - Exception: You may use SVG/PNG icons from https://fonts.google.com/icons IF you keep a `licenses.txt` file in your repo (same folder as this README) that lists each image filename you have and for each filename you say "from https://fonts.google.com/icons using the Apache 2.0 License"
* Use arrays and objects when they each make sense
- Do not use `async` or `await` while learning promises
* Use Semantic HTML and semantic CSS class names
* Do not use floats to do more than manage flowing text with images
* Do not use HTML tables or CSS table layouts for anything other than tables of data
* Do not use `alert`, `prompt`, `confirm` or other blocking JS
* Do not use CSS preprocessors, minifiers, or other tools to modify your CSS
  * I and the TA(s) must be able to read it easily
* Follow the best practices as described in this course to date

## Grading

Note: The project is to show your understanding of the material from class.  If you don't show your understanding of class material, you can lose points, even if your assignment "works".  

**Do NOT copy or generate your work (see "do-not-copy-work.md" at the root of this repo).**

This assignment is graded as a base of 100 points
- Each Critical Requirement you miss is a minimum of -10 points, and may lose more
- Each Additional Requirement you miss is -2 points.  There may be MANY non-critical requirements, and they add up!
- Each Bonus Requirement is +2 points, and the Project grade may exceed 100%
  - Certain Bonus Requirement options count as more than 1 requirement.  A feature that counts as 2 Bonus Requirements is therefore worth +4 points
  - Remember that this project is 25% of the course grade, so just one +2 on this project is worth more than a -2 on every single assignment added together 
  - You should first fulfill all the Critical and Additional Requirements for the same reasons: missing them hurts more on a Project
- If you are not showing the lessons from class, your grade will be worse or even given a 0. Each week builds on the material from the previous week so it is important that you learn and practice the lessons from class.

### Critical Requirements
- Your submission demonstrates that you practiced the overall purpose of the assignment
- You create a PR with your code for this assignment roughly following the course process
- Your code runs (with or without correct details) when invoked using `npm install`; `npm run build`; `npm start`
  - This requires that you create the necessary script entries in package.json as shown in class
- The changing HTML of your application is not generated by or saved to the server
- You do not use client-side storage such as cookies, localStorage, storing info in the URL, etc, except for any `sid` cookie that stores the session id.
- You are using a single, static HTML file from the server side
- You hide/show content by using Conditional Rendering (meaning the HTML has/does not have the text), not by hiding content using CSS
- You are building your front end JS using webpack/babel as shown in class
  - Do not google/search a solution, you may not get the process used in class
- You have an earnest attempt at using a MVC breakdown for your client-side JS (one requirement)
  - A distinct state and ways to change that state (model)
  - A way to generate/replace HTML that is based on state alone (view/render)
  - Code that attaches listeners to react to actions, update the state, and calls the view 
  - The Critical requirement is only that you do so enough to demonstrate the concept.  Having errors while doing so is covered as Additional Requirements
- PR does not contain changes to files unrelated to the assignment
  - a root `.gitignore` file IS related and may be included
- Your JS event handlers are loaded using addEventListener()
- Do not use inline styles (one requirement)
  - Do not use `style` attributes
  - Do not use `style` properties
  - Do not write `<style>` elements
- You obeyed each of the listed "Do not" under "Restrictions" (each a separate requirement)

### Additional Requirements
- Did you create a correct and usable package.json file?
- Did you create a correct and usable configuration based on the material from class?
- Did you install ONLY permitted and appropriate modules?
- Did you create the expected scripts in package.json?
- Do the scripts correctly create the necessary files when the steps listed at the of Goals are followed?
- Did you follow the restriction against modifying server JS content?
- Each form field is properly associated with a text label
    - Quick test: click on the text of the label, the field should be selected
- Your PR has the correct branch name and follows other course expectations for a PR
- Your commit message should be a single sentence that completes the phrase "these changes _______" 
  - Without including the words "these changes"
- Your commit message makes sense if someone reading it doesn't know what assignment it is part of
- You removed/updated any comments that no longer apply to your files
- You followed the MVC practices shown in class
  - The exact files, file names, and details can vary as long as you are following an MVC breakdown
- You followed the best practices listed in the course so far, including but not limited to (each a separate requirement):
  - You used `const` instead of `let` when a variable was not reassigned
  - You did not use `var`
  - You used semicolons at the end of your statements
  - You used consistent indentation and spacing to make your code easier to read
  - You included blank lines to separate sections of code into "paragraphs"
  - You gave your files, variables, and functions useful and descriptive names
  - You used camelCase variable names
  - You did not use an array when an object makes more sense
    - An object makes more sense when you access elements by something other than position
    - Looping through or searching an array for a value is a sign you should have used an object
  - You did not use a C-Style for loop when a `for...of` loop would work
  - You used explicit `{...}` blocks for any `if (...){...}/else (...) {...}` and `for (...) {...}` constructions
  - Use semantic HTML elements when appropriate
  - Do not pick your HTML elements for their default rendered appearance
  - Do not use HTML elements to create space (no empty `<p>` elements, no `<br>` to create blank lines)
  - Properly indent HTML and CSS
  - Have no spaces around a "=" in an HTML attributes
  - Use double quotes around an HTML attribute value
  - Do not have multiple `<h1>` elements
  - Do not skip `<h1>`-`<h6>` levels
  - Each section subheading (`<h2>-<h6>`) should be a subheading of the previous heading of one number less
  - HTML/CSS classes must be semantic (not utility)
  - HTML/CSS classes must be kebab-case or BEM two dashes style
  - CSS declarations have a space after the `:`
  - CSS selectors tend to use class names 
  - CSS selectors with just element types or combinations of types are setting defaults for that element type, not a specific appearance for a particular usage of that element type
  * Do not have console.log messages related to debugging
  * Do not have commented out code
  * Do not have comments that explain what the code itself says
    - Comments should explain WHY code is doing what it does, provide context, or (very rarely) explain a dense/complex algorithm
- Any other detail mentioned in class or the instructions may be an Additional Requirement
- Would a user understand what to do on each page?
- If a user logs in and reloads the page, does it end up showing the same content (without requiring the user to log in again)?
- Do event handlers/service calls change state instead of directly changing HTML?
- Is any derived state kept out of state itself and recalculated as needed?
- Does the front end code store data only about the currently logged in user?
- Are you changing the apparent "Page" for the user based on JS state?
- Are the correct service calls made when needed by requirements?
- Are error message for the user made visible to the user in the HTML?
- Are responses checked for when they report an error from the service?
- Do service calls notice and report to the user any network issues correctly?
- Are you sending and receiving JSON data?
- Are you using correct headers when sending the data?
- Do you change state based on data from service calls?
- Do you understand what the code you are submitting does well enough to explain to your team?
- Make sure to include a comment saying "generation: confirmed" unless I have a policy about LLM-generated code
- Are users logged in using a separate session id for each browser login?
- Is server state managed, updated, and reported with separation of concerns?
- Is "dog" treated as a bad password/bad authentication, distinct from a invalid username?
- Is the username validated using an allowlist of valid characters?
- Are only logged in users shown the option to logout?
- Is session data separate from non-session data?
- Does logout remove the sid from both the server side session AND the browser?
- Can a user have multiple simultaneous sessions (using different browsers/profiles) and only be listed once in the user list?
- Are users shown in the displayed user list when they login?
- Are users removed from the displayed user list when they logout?
- Is a user with multiple simultaneous sessions only removed from the displayed user list when all sessions have logged out?
- Can multiple users post messages without interfering with each other (in terms of data, users talking over each other is part of the chat experience)
- Can a user logout and log back in to still see their game in progress?
- Does every backend endpoint that is meant to be used only by logged in users check the validity of the session id and respond as required?
- Do the backend endpoints that receive user data validate using an allowlist respond as required to invalid data?
    - Note: Though insecure, this project does not require sanitization of message data, only that empty messages are rejected
- Is "dog" denied access differently than a username of invalid characters?
- Does the SPA check for an existing session (using RESTful service) on load?
- Does the SPA display and allow login using a RESTful service if there is no session?
- If a user is logged in, does the SPA allow logout using a RESTful service?
- After logout is the user able to login?
- Are all endpoints using RESTful methods and paths?
- Do all endpoints paths include /api/ and a version number?
- Are all endpoints sending and receiving JSON data?
- Do endpoints return these status codes with their responses when appropriate?
    - 400 (empty message; invalid username on login)
    - 401 (calling a service with missing/invalid sid)
    - 403 (attempting a login as username "dog")
- No endpoint should result in a redirect
- Are loading indicators used for the required service calls?
- Are users informed of or given the ability to correct any error status
    - Hint: Those are two different options.  Putting a message in the HTML is "informing" the user. Having the front end display a login form is "giving the ability to correct".  Each error should result in one of those options.
    - Are displayed error messages understandable to the user?
    - Are displayed error messages specific enough ("something is wrong" is not a specific error message)?
- Does a logged in user have new messages/users updated using ~5s polling?
- Is polling stopped when a user logs out?
- Is all text legible? Of sufficient size, clarity, and contrast?
- Are different parts of the page content visually distinct?
- Is it clear what the user should do?
- Is it clear what the user can do?
- Is it clear what the information on screen means?
- Does the page handle most reasonable desktop sizes without jumbled presentation or horizontal scrolling?
- Is it clear which messages came from which users?
- Are messages from users that are currently logged out still listed as from those users?
- Can a message be typed without the polling removing a message in progress?
- Is client state managed, updated, and reported with separation of concerns?
- Is client state distinct in structure (even if similar) from server state?
- Does client state only reflect the material for this user?
- Is the client HTML updated based on the current state, not the recent event?
- Are service calls separated from the code that triggers them?
- Are service calls separated from the changes they result in?

### Bonus Requirements (Extra Credit)

These regard work done _beyond_ the requirements to get 100% on the project. 
- These need to be complete, per the guidelines of the course material, and working to count.  A poorly implemented feature, or one implemented in a way that does not show an understanding of course material gives no points.
- These do not change any requirements, make sure those are still fulfilled
- These do not permit using outside libraries, services, etc - this is meant to show your advanced knowledge of the concepts from class.

- Provide a nice and pleasant UI that involves more work than the minimum to provide functionality and trivial modifications (counts as 1 bonus requirement)
- Provide additional chat functionality: 
    - DMs between users and/or the option for separate chat "channels" (counts as 2 bonus requirements)
- Provide some means by which the polling only receives messages that are new to this user (rather than a full list of all messages) (counts as 2 bonus requirements)

