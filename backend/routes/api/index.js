// backend/routes/api/index.js
const router = require('express').Router();
const sessionRouter = require('./session.js');
const usersRouter = require('./users.js');
const spotsRouter = require('./spots.js')
const reviewRouter = require('./reviews.js')
const bookingRouter = require('./bookings')
const imageRouter = require('./images.js')


// GET /api/restore-user
const { restoreUser } = require('../../utils/auth.js');

router.use(restoreUser);



router.use('/session', sessionRouter);
router.use('/users', usersRouter);
router.use('/spots', spotsRouter);
router.use('/reviews', reviewRouter)
router.use('/bookings', bookingRouter)
router.use('/images', imageRouter)


// router.post('/test', (req, res) => {
//   res.json({ requestBody: req.body });
// });


module.exports = router;
