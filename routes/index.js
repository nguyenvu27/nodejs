var express = require('express');
var router = express.Router();
var Hotel = require('../models/hotels');
var Room = require('../models/rooms');

var multer = require('multer');
var shortid = require('shortid');
// config noi luu tru va ten anh upload len
var storage = multer.diskStorage({
  // noi luu tru
  destination: function (req, file, cb) {
    cb(null, './public/uploads');
  },
  // cau hinh ten file - giu nguyen ten file goc
  filename: function (req, file, cb) {
    cb(null, shortid.generate() + "--" + file.originalname);
  }
});



var upload= multer({storage: storage});
router.get('/api/hotels', async (req, res, next) => {
  Hotel.find({}, (err, data) => {
    res.json({HOTELS: data});
  })
})
router.post('api/add-hotel', (req,res,next)=>{
  var hotelname = req.body.firstParams;
})
router.get('/api/rooms/:cId', async (req, res, next) => {
  Room.find({hotelid: req.params.cId},(err, data) => {
        console.log(data);
        res.json({ROOMS: data});
      });

})


/* GET home page. */
router.get('/', function (req, res, next) {
  Room.find({})
  .populate('hotelid')
  .exec((err, data) => {
    console.log(data);
    res.render('index', { rooms: data });
  });
});


router.get('/Hotels', function (req, res, next) {
  Hotel.find({}, function (err, data) {
    // console.log(data);
    res.render('Hotels', { hotels: data });
  });
});

router.get('/hotels/add', function (req, res, next) {
  res.render('hotels/Add', { title: 'Add' });
});

router.get('/hotels/edit', function (req, res, next) {
  res.render('hotels/Edit', { title: 'Edit' });
});

router.get('/rooms/add', function (req, res, next) {
  Hotel.find({}, (err,data)=>{

    res.render('rooms/Add', { hotels: data });

  })
  
});


router.get('/rooms/edit', function (req, res, next) {
  res.render('rooms/Edit', { title: 'Edit' });
});


router.post('/hotels/save-add', upload.single('image'), function (req, res, next) {

  // res.json(req.file.path.replace('public',''));
  //thu thập dữ liệu từ form
  let { name, city, address, owner, license_number, total_floor, image } = req.body;

  
  let model = new Hotel();

  // Cập nhật lại thông tin đối tượng vừa tạo với dữ liệu thu thập được từ form
  model.name = name;
  model.city =  city;
  model.address = address ; 
  model.owner = owner ;
  model.license_number = license_number ; 
  model.total_floor = total_floor ;
  model.image = req.file.path.replace('public', '');

  // Lưu đối tượng với csdl
  model.save(function (err) {
    if (err) {
      res.send('Lưu không thành công');
    }
    // điều hướng website về danh sách danh mục
    res.redirect('/Hotels');
  });
  //Thêm
});

//======== xoa san pham=========//
router.get('/hotels/remove/:hotelId', function (req, res, next) {
  Hotel.deleteOne({ _id: req.params.hotelId }, function (err) {
    res.redirect('/Hotels');
  });
});


router.get('/hotels/edit/:cId', function (req, res, next) {
  Hotel.findOne({ _id: req.params.cId }, function (err, data) {

    if (err) {
      res.send('ID khong ton tai');
    }
    // res.json(data);
    res.render('hotels/Edit', { hotel: data });
  })
});

router.post('/hotels/save-edit', upload.single('image'), function (req, res, next) {
  Hotel.findOne({ _id: req.body.id }, function (err, model) {
    if (err) {
      res.redirect('back');
    }

    model.name = req.body.name;
    model.city = req.body.city;
    model.address = req.body.address ; 
    model.owner = req.body.owner ;
    model.license_number = req.body.license_number ; 
    model.total_floor = req.body.total_floor ;
    if (req.file != null) {
      model.image = req.file.path.replace('public', '');
    }

    model.save(function (err) {
      if (err) {
        res.send('Luu khong thanh cong');
      }

      res.redirect('/Hotels');
    })
  })
});
//=== Luu san pham laij bang Cates========//

/// rooms ///////////////

router.post('/rooms/save-add', upload.single('image'), (req, res, next) => {
  var model = new Room();
  model.room_number = req.body.room_number;
  model.floor = req.body.floor;
  model.hotelid = req.body.hotelid;
  model.single_room = req.body.single_room;
  model.price = req.body.price;
  model.status = req.body.status;
  model.image = req.file.path.replace('public', '');
  model.detail = req.body.detail;

  model.save((err) => {
    if(err){
      res.send('Luu khong thanh cong');
    }

    res.redirect('/');
  })
});

router.get('/rooms/remove/:pId', (req, res, next) => {
  Room.deleteOne({ _id: req.params.pId }, (err) => {
    if (err) {
      res.send('Xoa khong thanh cong');
    }
    res.redirect('/');
  });
});


router.get('/rooms/edit/:pId', (req, res, next) => {
  Hotel.find({}, (err, data) => {

    Room.findOne({ _id: req.params.pId }, (err, roomData) => {
      if (err) {
        res.send('id san pham khong ton tai');
      }

      for (var i = 0; i < data.length; i++) {
        if (data[i]._id == roomData.hotelid.toString()) {
          data[i].selected = true;
        }
      }

      res.render('rooms/Edit', { hotels: data, rooms: roomData });
    });
  })

});

router.post('/rooms/save-edit', upload.single('image'), function (req, res, next) {
  Room.findOne({ _id: req.body.id }, function (err, model) {
    if (err) {
      res.redirect('back');
    }

    model.room_number = req.body.room_number;
  model.floor = req.body.floor;
  model.hotelid = req.body.hotelid;
  model.single_room = req.body.single_room;
  model.price = req.body.price;
  model.status = req.body.status;
  model.detail = req.body.detail;
    if (req.file != null) {
      model.image = req.file.path.replace('public', '');
    }

    model.save(function (err) {
      if (err) {
        res.send('Luu khong thanh cong');
      }

      res.redirect('/');
    })
  })
});



module.exports = router;
