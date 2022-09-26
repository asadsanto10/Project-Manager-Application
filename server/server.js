const auth = require('json-server-auth');
const jsonServer = require('json-server');
const express = require('express');
const http = require('http');

const app = express();
const server = http.createServer(app);
const router = jsonServer.router('db.json');
const middlewares = jsonServer.defaults();
const port = process.env.PORT || 9000;
const io = require('socket.io')(server);

// response middleware
// router.render = (req, res) => {
//   const { path } = req;
//   const { method } = req;

//   if (path.includes('/conversations') && (method === 'POST' || method === 'PATCH')) {
//     // emit socket event
//     io.emit('conversation', {
//       data: res.locals.data,
//       type: method === 'POST' ? 'conversationAdd' : 'conversationEdit',
//     });
//   }
//   if (path.includes('/messages') && (method === 'POST' || method === 'PATCH')) {
//     // emit socket event
//     io.emit('message', {
//       data: res.locals.data,
//     });
//   }

//   res.json(res.locals.data);
// };
// Bind the router db to the app
app.db = router.db;
global.io = io;
app.use(middlewares);

const rules = auth.rewriter({
  users: 640,
  conversations: 660,
  messages: 660,
});

app.use(rules);
app.use(auth);
app.use(router);

server.listen(port);
