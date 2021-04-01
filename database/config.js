

const mongoose = require('mongoose');

const dbConnection = async() => {


  try {

    await mongoose.connect( process.env.DB_CNN , {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true
    });
    
  } catch (error) {
    throw new Error('Error a la hora de inicializar la base de datos')
  }

}

module.exports = {
  dbConnection
}