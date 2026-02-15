import app from "./app.ts";
import connectDB from "./config/db.config.ts";

const PORT = process.env.PORT || 5000; 

const start = async () => {
  try {
    await connectDB();

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });

  } catch (error) {
    console.error("Server failed to start:", error);
    process.exit(1);
  }
};

start();
