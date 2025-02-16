const mongoose = require('mongoose');

const mongoDB = async (uri) => {
  try {
    await mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('Connected to MongoDB');
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
  }
};

const dexcomDataSchema = new mongoose.Schema({
  value: Number,
  trend: String,
  time: Date,
});

const DexcomData = mongoose.model('DexcomData', dexcomDataSchema);

module.exports = { mongoDB, DexcomData };
