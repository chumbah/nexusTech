require("dotenv").config({
  path: "./.env"
});

const crypto = require("crypto");
const { neon } = require("@neondatabase/serverless");
const { drizzle } = require("drizzle-orm/neon-http");
const { eq, desc } = require("drizzle-orm");


const {
  serviceInquiries,
  estimates,
  adminUsers
} = require("../src/schema");


// Neon connection
const sql = neon(process.env.DATABASE_URL);

const db = drizzle(sql);


// Hash password
function hashPassword(password) {
  return crypto
    .createHash("sha256")
    .update(password)
    .digest("hex");
}


// Test connection
async function testConnectionAndMigrate() {
  try {

    await sql`SELECT 1`;

    console.log(
      "Successfully connected to Neon PostgreSQL!"
    );

    await createDefaultAdmin();

  } catch(error) {

    console.error(
      "Neon connection failed:"
    );

    console.error(error.message);
  }
}



// ======================
// INQUIRIES
// ======================

async function saveInquiry(
  name,
  email,
  phone,
  company,
  message,
  service_type
){

  const result =
    await db
    .insert(serviceInquiries)
    .values({

      name,
      email,
      phone,
      company,
      message,

      serviceType: service_type

    })
    .returning();


  return result[0];

}



async function getAllInquiries(){

  return await db
    .select()
    .from(serviceInquiries)
    .orderBy(
      desc(serviceInquiries.date)
    );

}




// ======================
// ESTIMATES
// ======================


async function saveEstimate(
  name,
  email,
  phone,
  items_selected,
  total_price
){


  const result =
    await db
    .insert(estimates)
    .values({

      name,
      email,
      phone,

      itemsSelected:
        typeof items_selected === "string"
        ? items_selected
        : JSON.stringify(items_selected),


      totalPrice: total_price

    })
    .returning();



  return result[0];

}




async function getAllEstimates(){

  return await db
    .select()
    .from(estimates)
    .orderBy(
      desc(estimates.date)
    );

}





// ======================
// ADMIN
// ======================


async function createDefaultAdmin(){


  const existing =
    await db
    .select()
    .from(adminUsers)
    .where(
      eq(adminUsers.userName,"admin")
    );



  if(existing.length === 0){


    await db
    .insert(adminUsers)
    .values({

      userName:"admin",

      passwordHash:
        hashPassword("admin123")

    });


    console.log(
      "Default admin created"
    );

  }

}




async function verifyAdmin(
  username,
  password
){


  const result =
    await db
    .select()
    .from(adminUsers)
    .where(
      eq(adminUsers.userName, username)
    );


  if(result.length === 0){
    return false;
  }


  return (
    result[0].passwordHash ===
    hashPassword(password)
  );

}



module.exports = {

  db,

  testConnectionAndMigrate,

  saveInquiry,
  getAllInquiries,

  saveEstimate,
  getAllEstimates,

  createDefaultAdmin,
  verifyAdmin

};