var r = require('rethinkdb');
var conn;
r.connect({
     host: 'localhost',
     password: '19970920Fenrir'
}, function(err, connection) {
    if (err) throw err;
    conn = connection;
});
var table = r.db('momont').table('users');
var checkSession= (sess,fn) => {
    table.filter({sess:sess}).run(conn,(err,res)=>{
      if (err) console.log("arr");
      res.toArray((err,item)=>{
        if (err) console.log(err);
        return fn(item);
      })
    })
  }

var checkUser = (id,fn) => {
  table.get(id).run(conn,(err,res)=>{
    return fn(res);
  })
}

var newApi = (id,io,fn) => {
  table.get(id).update({sess:io}).run(conn,(err,res)=>{
    return fn()
  })
}

var newUser = (id,io,fn) => {
  table.insert({id:id}).run(conn,(err,res)=>{
    return fn()
  })
}

module.exports.checkSession = checkSession;
module.exports.checkUser = checkUser;
module.exports.newApi = newApi;
module.exports.newUser = newUser;