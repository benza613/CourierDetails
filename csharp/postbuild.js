//var fs = require('fs');
const fs = require('fs-extra');
// edit this with your file names
templfile = 'csharp/CD.aspx';
distfile = 'dist/CourierDetails/CD.aspx';
distIndexfile = 'dist/CourierDetails/index.html';

srcdir = 'dist/CourierDetails';
//destdir = 'C:\\Users\\benza\\Source\\Repos\\IT1\\OTWLFRT\\CourierDetails';
destdir = 'C:\\Users\\IT1\\Source\\Repos\\IT1\\OTWLFRT\\CourierDetails';
//destdir = 'C:\\Users\\OTWL-D034\\source\\repos\\IT1\\OTWLFRT\\CourierDetails';

// destination will be created or overwritten by default.
fs.copyFile(templfile, distfile, (err) => {
  if (err) throw err;
  console.log('Template was copied to destination');
  ReadAppend(distfile, distIndexfile);
});

function ReadAppend(file, appendFile) {
  fs.readFile(appendFile, 'utf8', function (err, data) {
    if (err) throw err;

    var result = data.replace('head', 'head runat="server"');

    console.log('File was read');

    fs.appendFile(file, result, function (err) {
      if (err) throw err;
      console.log('The "data to append" was appended to file!');

      // copies directory, even if it has subdirectories or files
      fs.copy(srcdir, destdir, err => {
        if (err) return console.error(err)

        console.log('exported to working dir!')
      })
    });
  });
}
