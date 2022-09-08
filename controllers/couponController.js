//get update and delete is not done

const mongoose = require("mongoose");
const Coupon = require("../models/coupon");
const User = require("../models/user");
const catchasync = require("../middleware/catchAsyncErrors");

exports.GenerateCouponCode = catchasync(async (req, res) => {
  try {
    const { Start_Date, End_Date, User_id, Code, bussiness_id, offer_Tittle,
      description,
      Minimun_order, percentageOff } = req.body;

    const finduser = await User.find()

    if (!finduser) {
      res.status(400).json({
        error: "We Unable To Get User sWith This Information ",
        success: false
      })
    }

    if (finduser) {
      for (let i = 0; i < finduser.length; i++) {
        let data = {
          User: finduser[i]._id,
          Status: false
        }
        User_id.push(data)
      }
    }

    console.log(User_id, "user_id")


    let Coupons = await Coupon.create({
      offer_Tittle,
      description,
      Minimun_order,
      Start_Date,
      End_Date,
      User_id,
      Code,
      bussiness_id: req.user._id,
      percentageOff
    });

    if (!Coupons) {
      res
        .status(400)
        .json({
          error: "We Unable To Generate Code With This Information ",
          success: false
        });
      return;
    }

    // if (Coupons) {
    //   await Coupons.save();
    //   let AllUser = await User.find();
    //   console.log(AllUser , "Alluser")
    //   for (let i = 0; i < AllUser.length; i++) {
    //     const UpdateId = await User.findByIdAndUpdate(AllUser[i]._id, {
    //         $push: {
    //             "CouponCodes": { code_id: Coupons._id, Status: true },
    //         }
    //     }, { new: true }
    //     );
    //     console.log(UpdateId , "UpdateId");
    //   }
    // }
    // res.status(200).json({message : "We Doest find any user for Adding coupon code"})
    // return

    res.status(200).json({
      success: true,
      message: "Code Is Generaed",
      Coupons: Coupons
    });
    return;
    // }
  } catch (error) {
    console.log(error);
    res.status(400).json({ error: "We Unable To Generate Code " });
  }
})

exports.ApplyCoupenCode = catchasync(async (req, res) => {
  try {
    const { couponid, user, Status, percentageOff } = req.body;

    // find coupon 
    const findCoupon = await Coupon.findById(couponid)
    console.log(findCoupon)
    if (!findCoupon) {
      res.status(400).json({
        success: false,
        message: "COupon Code Is Invalid",
      });
    }

    if (findCoupon) {

      const currentDate = new Date()
      const coupendate = new Date(findCoupon.End_Date)
      console.log(currentDate, "currentDate")
      if (currentDate.getDate() > coupendate.getDate()) {
        console.log(currentDate.getDate(), "currentDate.getDay()")
        console.log(coupendate.getDate(), "coupendate.getDay()")
        console.log("coupon expired")

        res.status(400).json({
          success: false,
          error: "Coupon code is expired"
        })
        return
      }

      const updateCoupon = await Coupon.updateOne({
        _id: couponid,
        User_id: {
          $elemMatch: { User: user }
        },
      },
        {
          $set: { "User_id.$.Status": Status },
          // new: true,
        }, { new: true })


      if (!updateCoupon) {
        res.status(400).json({
          success: false,
          message: "cannnot update",
        });
      }

      if (updateCoupon) {

        const findCoupon1 = await Coupon.findById(couponid)

        res.status(200).json({
          success: true,
          message: "succesfully added",
          updateCoupon: updateCoupon,
          data: findCoupon1,
        });
      }

    }

  } catch (error) {
    console.log(error);
    res.status(400).json({ error: "We Unable To Generate Code " });
  }
})


exports.UpdateCoupon = async (req, res) => {
  try {
      const data = req.body;
      console.log(data)
      
      const findCoupon = await Coupon.findById(req.params.id)
      

      if (!findCoupon) {
          res.status(400).json({ 
              success : false, 
              error : "Not Find This Record" 
          })
          
          return
      }

      if (findCoupon) {

          const updateCoupon = await Coupon.findByIdAndUpdate(req.params.id ,  data  , {new : true})

          if (!updateCoupon) {
              res.status(400).json({ 
                  success : false, 
                  error : "Unable To Update The Record" 
              })
              
              return
          }

          if (updateCoupon) {
              res.status(200).json({ 
                  success : true, 
                  message : "Coupon Is Updated" ,
                  data : updateCoupon
              })
              
              return
          }
          
      }
  } catch (error) {
      console.log(error)
      res.status(500).json({ 
          success : false, 
          error : "Update Coupon Is Not Possible" 
      })
  }
}

// exports.ApplyCoupenCode = catchasync(async (req, res) => {
//     try {
//       // params user id and from body it is coupon id

//       // const { coupon_id , user_id }
//       const CheckUser = await User.findById(req.params.id);

//       if (!CheckUser) {
//         res.status(400).json({ message: "unble to find user" })
//         return
//       }

//       if (CheckUser) {
//         const CheckCoupen = await Coupon.findById(req.body.id)
//         if (!CheckCoupen) {
//           res.status(400).json({ message: "This Coupen Doesnot exist" })
//           return
//         }

//         if (CheckCoupen) {
//           const CheckCoupounstatus = await User.findById(req.params.id)
//           // const id = req.body.id
//           let dataArray = []
//           if (CheckCoupounstatus) {
//             console.log(typeof (CheckCoupounstatus.CouponCodes));
//             // CheckCoupounstatus.CouponCodes && CheckCoupounstatus.CouponCodes.map(e=>{
//             //   console.log(e);
//             // })
//             dataArray.push(CheckCoupounstatus.CouponCodes)
//             // console.log(dataArray , "DataArray")
//             console.log(CheckCoupounstatus.CouponCodes.code_id ,"CheckCoupounstatus.CouponCodes.code_id" );
//             // dataArray = CheckCoupounstatus.CouponCodes

//             if (CheckCoupounstatus.CouponCodes.code_id.toString() === req.body.id && CheckCoupounstatus.CouponCodes.Status.toString() === 'false') {
//               console.log('checked status')
//               res.status(400).json({ message: "this coupun already applied " })
//               return
//             }

//             console.log(CheckCoupounstatus.CouponCodes , "CheckCoupounstatus.CouponCodes")

//             // let newarray1 = new Array(...CheckCoupounstatus.CouponCodes)
//             // console.log(newarray1 , "newarray")
//             // console.log(newarray1.length , "newarray[i]")

//             // previous logic 
//             console.log(CheckUser.CouponCodes , "checkuser.couponcode")
//             console.log(CheckUser.CouponCodes.length , "checkuser.couponcode.length")

//           //   const UserCoupen = await User.find({ _id : CheckUser._id , "CouponCodes": { "$elemMatch": { "code_id": req.body.id }}}
//           // )
//           //   console.log(UserCoupen , "usercouprn")
//             // const UserCoupen = await User.findByIdAndUpdate(CheckUser._id , {
//             //   // $set: { "CouponCodes.$[status]": false } 
//             //   $set : {
//             //     "CouponCodes.$": [{
//             //         code_id: req.body.id,
//             //         Status: false
//             //       }]
//             //   }
//             // }, {new : true})

//             // previous 
//             const UserCoupen = await User.findByIdAndUpdate(CheckUser._id, {
//               CouponCodes: [
//                 // CheckUser.CouponCodes,
//                 {
//                   code_id: req.body.id,
//                   Status: false
//                 }
//               ]
//             }, { new: true })

//             if (!UserCoupen) {
//               res.status(400).json({ message: "Coupen is not updated" })
//               return
//             }

//             if (UserCoupen) {
//               res.status(200).json({ message: "Coupen Apply Succesfully", UserCoupen })
//               return
//             }
//             return
//           }
//         }
//         return
//       }
//     } catch (error) {
//       console.log(error);
//       res.status(400).json({ error: "We Unable To Generate Code " });
//     }
//   })


exports.getCoupon = async (req, res) => {
  try {

    console.log(req.user)
    const getCoupon = await Coupon.find({ bussiness_id: req.user._id })
    if (!getCoupon) {
      return res.status(400).json({
        message: "No offer currently",
        success: false
      })
    }
    if (getCoupon) {
      res.status(200).json({
        message:"offers",
        success:true,
        data:getCoupon
      })
      return
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ err: "We Unable To Generate Code " });
  }
}