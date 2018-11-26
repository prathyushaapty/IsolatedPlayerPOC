function qbind(a) { console.log('a'); }
qbind = qbind.bind();
console.log(qbind);

// Function.prototype.bind = function(b) {
//   var a = this;
//   return function() {
//       return a.apply(b, arguments)
//   }
// }
// ;