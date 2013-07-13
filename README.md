# Code in Tune

A real-time code collaboration tool, built with Node.js, Express, Socket.io and [Ace Editor](http://ajaxorg.github.io/).

While experimenting with Node and sockets, I had this idea to develop a project which would be kinda cool and a good learning experience. It started as a simple prototype to update one or more connected editors with code changes, but was developed a bit more to add rooms, chat, users, etc.

The whole idea revolves around rooms. When a visitor creates a room, he or she can share the URL to her friends and have a coding party. Everyone can code independently in a non-destructive way, pushing and pulling code changes on each keystroke, and in the same time chat with the unobtrusive controls. I even did a simple design for it and created a website: [codeintune.com](http://www.codeintune.com), which is included in the files.

## Installation

You will need Node.js installed on your machine (obviously); I did my tests with a recent v0.10.12, but older versions shouldn't be a problem.

After cloning or downloading the repo, navigate to that folder and install dependencies (defined in package.json).

    $ npm install

Start the server! It will run on http://localhost:1337 by default.

    $ node app.js

If you want to change the server and/or port, you'll have to edit two lines.

The server port is a variable in /app.js at line 5.

    $ port = 1337

There's also the client socket connection in /public/js/app/socket.js at line 13.

    $ this.socket = io.connect('http://localhost:1337');

## Licence

You're free to use, modify and distribute, partially or completely, in whatever way you seem fit. There's no limitation! However, a link to the original project would be appriciated.

## Known Issues and Limitations

1. As there is no strategy for deploying code changes, when multiple persons edit a single line, strange things happen. This can be resolved very easily with ShareJS, which is an Operational Transform library and was build exactly for real-time editing. However, as it uses BrowserChannel instead of Socket.io and this was an experiments with the latter, I chose to stay away from ShareJS.
2. The code editor's history is untouched, which means that it behaves in the same way as if it was a single editor. Undo or redo will apply to both changes of the user and clients and it makes it unreliable. However, Ace has got a nice UndoManager and this is something I'll try to address in the future.