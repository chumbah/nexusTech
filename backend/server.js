const express = require("express");
const cors = require("cors");
const db = require("./database");
require("dotenv").config();

const app = express();

const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());


// Logging middleware
app.use((req, res, next) => {
  console.log(
    `[${new Date().toISOString()}] ${req.method} ${req.path}`
  );
  next();
});


// Admin token
const ADMIN_TOKEN = "nexus-admin-token-secret-9988";


function verifyAdminToken(req, res, next) {

  const authHeader = req.headers.authorization;

  if (!authHeader?.startsWith("Bearer ")) {
    return res.status(401).json({
      error: "Unauthorized"
    });
  }


  const token = authHeader.split(" ")[1];


  if (token !== ADMIN_TOKEN) {
    return res.status(403).json({
      error: "Invalid token"
    });
  }


  next();
}



// ==========================
// INQUIRIES
// ==========================

app.post("/api/inquiries", async (req, res) => {

  try {

    const {
      name,
      email,
      phone,
      company,
      message,
      service_type
    } = req.body;


    if (!name || !email || !message || !service_type) {
      return res.status(400).json({
        error: "Missing required fields"
      });
    }


    const inquiry = await db.saveInquiry(
      name,
      email,
      phone || "",
      company || "",
      message,
      service_type
    );


    res.status(201).json({
      success: true,
      inquiry
    });


  } catch (error) {

    console.error(error);

    res.status(500).json({
      error: "Failed to save inquiry"
    });

  }

});



// ==========================
// ESTIMATES
// ==========================

app.post("/api/estimates", async (req, res) => {


  try {


    const {
      name,
      email,
      phone,
      items_selected,
      total_price
    } = req.body;



    if (
      !name ||
      !email ||
      !items_selected ||
      total_price === undefined
    ) {

      return res.status(400).json({
        error: "Missing estimate fields"
      });

    }



    const estimate = await db.saveEstimate(
      name,
      email,
      phone || "",
      items_selected,
      total_price
    );



    res.status(201).json({
      success:true,
      estimate
    });



  } catch(error){

    console.error(error);

    res.status(500).json({
      error:"Failed to save estimate"
    });

  }


});





// ==========================
// ADMIN LOGIN
// ==========================

app.post("/api/admin/login", async(req,res)=>{


  try {

    const {
      username,
      password
    } = req.body;



    const valid = await db.verifyAdmin(
      username,
      password
    );



    if(!valid){

      return res.status(401).json({
        error:"Invalid login"
      });

    }



    res.json({
      success:true,
      token:ADMIN_TOKEN
    });



  } catch(error){

    console.error(error);

    res.status(500).json({
      error:"Login failed"
    });

  }


});





// ==========================
// ADMIN DATA
// ==========================


app.get(
"/api/admin/inquiries",
verifyAdminToken,
async(req,res)=>{


  const data =
    await db.getAllInquiries();


  res.json({
    success:true,
    inquiries:data
  });


});




app.get(
"/api/admin/estimates",
verifyAdminToken,
async(req,res)=>{


  const data =
    await db.getAllEstimates();


  res.json({
    success:true,
    estimates:data
  });


});




// health check

app.get("/api/health",(req,res)=>{

  res.json({
    status:"ok"
  });

});




// start

async function startServer(){

  await db.testConnectionAndMigrate();


  app.listen(
    PORT,
    ()=>{
      console.log(
        `Backend running on port ${PORT}`
      );
    }
  );

}


startServer();